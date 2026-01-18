#include <gtest/gtest.h>
#include <sys/socket.h>
#include <unistd.h>
#include <string>
#include "../src/SocketIO.h"
using namespace std;

static void openPair(int sp[2]) {
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sp), 0);
}

void sendProtocolMsg(int fd, string payload) {
    string fullMsg = to_string(payload.length()) + "\n" + payload;
    send(fd, fullMsg.c_str(), fullMsg.length(), 0);
}

TEST(SocketIOTest, ReadCommandBasic) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    sendProtocolMsg(sp[1], "add file45 hello world!");

    string cmd = io.read();
    EXPECT_EQ(cmd, "add");
    EXPECT_EQ(io.getLine(), "file45 hello world!");

    close(sp[1]);
    close(sp[0]);
}

TEST(SocketIOTest, ReadSkipManyLeadingSpaces) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    sendProtocolMsg(sp[1], "      blabla myFile hi Hemi");

    string cmd = io.read();
    EXPECT_EQ(cmd, "blabla");
    EXPECT_EQ(io.getLine(), "myFile hi Hemi");

    close(sp[1]);
    close(sp[0]);
}

TEST(SocketIOTest, CaseInsensitivity) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    sendProtocolMsg(sp[1], "AdD FiLe HelLo WoRlD");

    string cmd = io.read();
    EXPECT_EQ(cmd, "add");
    EXPECT_EQ(io.getLine(), "FiLe HelLo WoRlD");

    close(sp[1]);
    close(sp[0]);
}

TEST(SocketIOTest, ReadWithoutNewlineReturnsWholeLine) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    sendProtocolMsg(sp[1], "add file45 hello");
    shutdown(sp[1], SHUT_WR);

    string cmd = io.read();
    EXPECT_EQ(cmd, "add");
    EXPECT_EQ(io.getLine(), "file45 hello");

    close(sp[1]);
    close(sp[0]);
}

TEST(SocketIOTest, ChunkedInput) {
    int sp[2];
    openPair(sp);
    SocketIO io(sp[0]);

    send(sp[1], "1", 1, 0);
    send(sp[1], "1\nad", 4, 0); 
    
    send(sp[1], "d file hi", 9, 0); 

    string cmd = io.read();
    
    EXPECT_EQ(cmd, "add");
    EXPECT_EQ(io.getLine(), "file hi");

    close(sp[1]); close(sp[0]);
}

TEST(SocketIOTest, MultipleCommandsOnePacket) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    string m1 = "add file1 hi";
    string p1 = to_string(m1.length()) + "\n" + m1;

    string m2 = "search file1";
    string p2 = to_string(m2.length()) + "\n" + m2;

    string combined = p1 + p2;
    send(sp[1], combined.c_str(), combined.length(), 0);

    string cmd1 = io.read();
    EXPECT_EQ(cmd1, "add");
    EXPECT_EQ(io.getLine(), "file1 hi");

    string cmd2 = io.read();
    EXPECT_EQ(cmd2, "search");
    EXPECT_EQ(io.getLine(), "file1");

    close(sp[1]);
    close(sp[0]);
}

TEST(SocketIOTest, WriteSendsAllBytes) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    string text = "hello world 123456789";
    io.write(text);

    char buf[128];
    memset(buf, 0, sizeof(buf));
    int n = recv(sp[1], buf, sizeof(buf), 0);
    ASSERT_GT(n, 0);

    string received(buf, n);
    int newlinePos = received.find('\n');
    
    string lenStr = received.substr(0, newlinePos);
    string payload = received.substr(newlinePos + 1);

    EXPECT_EQ(stoi(lenStr), text.length()); 
    EXPECT_EQ(payload, text);

    close(sp[1]); close(sp[0]);
}

TEST(SocketIOTest, ReadFromClosedSocket) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    close(sp[1]);

    EXPECT_THROW({
        io.read();
    }, std::runtime_error);

    close(sp[0]);
}


TEST(SocketIOTest, ExtremeLeadingSpaces) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    sendProtocolMsg(sp[1], "                           add hi");

    string cmd = io.read();
    EXPECT_EQ(cmd, "add");
    EXPECT_EQ(io.getLine(), "hi");

    close(sp[1]); close(sp[0]);
}

TEST(SocketIOTest, CommandWithoutArguments) {
    int sp[2];
    openPair(sp);
    SocketIO io(sp[0]);

    sendProtocolMsg(sp[1], "add");

    string cmd = io.read();
    EXPECT_EQ(cmd, "add");
    EXPECT_EQ(io.getLine(), "");

    close(sp[1]); close(sp[0]);
}

TEST(SocketIOTest, MissingCommand) {
    int sp[2];
    openPair(sp);
    SocketIO io(sp[0]);

    sendProtocolMsg(sp[1], "   ");

    string cmd = io.read();
    EXPECT_EQ(cmd, "");
    EXPECT_EQ(io.getLine(), "");

    close(sp[1]); close(sp[0]);
}

TEST(SocketIOTest, MixedCaseCommandLowercased) {
    int sp[2];
    openPair(sp);
    SocketIO io(sp[0]);

    sendProtocolMsg(sp[1], "SeArCh fileX");

    string cmd = io.read();
    EXPECT_EQ(cmd, "search");
    EXPECT_EQ(io.getLine(), "fileX");

    close(sp[1]); close(sp[0]);
}