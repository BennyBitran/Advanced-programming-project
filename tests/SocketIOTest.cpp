#include <gtest/gtest.h>
#include <sys/socket.h>
#include <unistd.h>
#include <cstring>
#include "../src/SocketIO.h"

using namespace std;

TEST(socketIOTest, readCommand) {
    int sp[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sp), 0);

    int fd_socketIO = sp[0];
    int fd_test = sp[1];

    SocketIO io(fd_socketIO);

    const char* message = "add file45 hello world!\n";
    int messageLen = strlen(message);

    send(fd_test, message, messageLen, 0);

    string command = io.read();

    EXPECT_EQ(command, "add");

    close (fd_test);
    close(fd_socketIO);
    
}


TEST(SocketIOTest, ReadSkipManyLeadingSpaces) {
    int sp[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sp), 0);

    int fd_socketio = sp[0];
    int fd_test     = sp[1];

    SocketIO io(fd_socketio);

    const char* msg = "      blabla myFile hi Hemi\n";  // many leading spaces
    int msgLen = strlen(msg);
    send(fd_test, msg, msgLen, 0);

    // read() should ignore ALL leading spaces and extract the command
    std::string cmd = io.read();
    EXPECT_EQ(cmd, "blabla");

    // Next getLine() must still work
    std::string line = io.getLine();
    EXPECT_EQ(line, "myFile hi Hemi");

    close(fd_test);
    close(fd_socketio);
}
