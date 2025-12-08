#include <gtest/gtest.h>
#include <sys/socket.h>
#include <unistd.h>
#include <string>
#include "../src/SocketIO.h"
using namespace std;

static void openPair(int sp[2]) {
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sp), 0);
}

TEST(SocketIOTest, ReadCommandBasic) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    const char* msg = "add file45 hello world!\n";
    send(sp[1], msg, strlen(msg), 0);

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
    const char* msg = "      blabla myFile hi Hemi\n";
    send(sp[1], msg, strlen(msg), 0);

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
    const char* msg = "AdD FiLe HelLo WoRlD\n";
    send(sp[1], msg, strlen(msg), 0);

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
    const char* msg = "add file45 hello";
    send(sp[1], msg, strlen(msg), 0);
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
    send(sp[1], "ad", 2, 0);
    send(sp[1], "d file hi\n", 10, 0);

    string cmd = io.read();
    EXPECT_EQ(cmd, "add");
    EXPECT_EQ(io.getLine(), "file hi");

    close(sp[1]);
    close(sp[0]);
}

TEST(SocketIOTest, MultipleCommandsOnePacket) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    const char* msg = "add file1 hi\nsearch file1\n";
    send(sp[1], msg, strlen(msg), 0);

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
    int n = recv(sp[1], buf, sizeof(buf), 0);
    ASSERT_GT(n, 0);
    // read length big endian
    uint32_t len = ((unsigned char)buf[0] << 24) |
                   ((unsigned char)buf[1] << 16) |
                   ((unsigned char)buf[2] << 8)  |
                   (unsigned char)buf[3];

    EXPECT_EQ(len, text.size());
    string received(buf + 4, n - 4);
    EXPECT_EQ(received, text);

    close(sp[1]);
    close(sp[0]);
}

TEST(SocketIOTest, ReadFromClosedSocket) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    close(sp[1]);

    string cmd = io.read();
    EXPECT_EQ(cmd, "");
    EXPECT_EQ(io.getLine(), "");

    close(sp[0]);
}

TEST(SocketIOTest, ExtremeLeadingSpaces) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    const char* msg = "                           add hi\n";
    send(sp[1], msg, strlen(msg), 0);

    string cmd = io.read();
    EXPECT_EQ(cmd, "add");
    EXPECT_EQ(io.getLine(), "hi");

    close(sp[1]);
    close(sp[0]);
}

TEST(SocketIOTest, CommandWithoutArguments) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    send(sp[1], "add\n", 4, 0);

    string cmd = io.read();
    EXPECT_EQ(cmd, "add");
    EXPECT_EQ(io.getLine(), "");

    close(sp[1]);
    close(sp[0]);
}

TEST(SocketIOTest, MissingCommand) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    send(sp[1], "   \n", 4, 0);

    string cmd = io.read();
    EXPECT_EQ(cmd, "");
    EXPECT_EQ(io.getLine(), "");

    close(sp[1]);
    close(sp[0]);
}

TEST(SocketIOTest, MixedCaseCommandLowercased) {
    int sp[2];
    openPair(sp);

    SocketIO io(sp[0]);
    send(sp[1], "SeArCh fileX\n", 13, 0);

    string cmd = io.read();
    EXPECT_EQ(cmd, "search");
    EXPECT_EQ(io.getLine(), "fileX");

    close(sp[1]);
    close(sp[0]);
}