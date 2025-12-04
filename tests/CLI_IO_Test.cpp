#include <gtest/gtest.h>
#include <sstream>
#include "../src/CLI_IO.h"
using namespace std;

// Test that write() sends data to the provided output stream
TEST(IOTest, WriteTests) {
    istringstream in("");  // no input needed for this test because we are only testing output
    ostringstream out; // we will capture output here

    CLI_IO io(in, out);

    io.write("hello");
    io.write(" world");

    // Everything written should be in out.str()
    EXPECT_EQ(out.str(), "hello\n world\n");
}

// Test that read() and getLine() parse the command and the rest of the line, respectively
TEST(IOTest, ReadTests) {
    // This simulates a user typing:  add file1 hello world
    istringstream in("add file1 hello world");
    ostringstream out; // we don't care about output for this test

    CLI_IO io(in, out);

    string cmd  = io.read(); //should give us only the command
    string rest = io.getLine(); //should give us the rest of the line

    EXPECT_EQ(cmd, "add");

    EXPECT_EQ(rest, "file1 hello world"); // our implementation keeps the leading space, we take care of it later
}
// Test that read() and getLine() handle empty input correctly
TEST(IOTest, ReadHandlesEmptyInput) {
    // This simulates a user pressing enter without typing anything
    istringstream in("\n");
    ostringstream out;

    CLI_IO io(in, out);

    string cmd  = io.read();
    string rest = io.getLine();

    EXPECT_EQ(cmd, "");  // No command entered
    EXPECT_EQ(rest, ""); // No additional input
}
//test that multiple reads work correctly
TEST(IOTest, MultipleReadsWorkCorrectly) {
    // This simulates a user typing multiple commands
    istringstream in("first command line one\nsecond command line two\n");
    ostringstream out;

    CLI_IO io(in, out);

    string cmd1  = io.read();
    string rest1 = io.getLine();

    string cmd2  = io.read();
    string rest2 = io.getLine();

    EXPECT_EQ(cmd1, "first");
    EXPECT_EQ(rest1, "command line one");

    EXPECT_EQ(cmd2, "second");
    EXPECT_EQ(rest2, "command line two");
}

// Test that write() handles empty strings correctly
TEST(IOTest, WriteHandlesEmptyString) {
    istringstream in("");
    ostringstream out;

    CLI_IO io(in, out);

    io.write("");
    io.write("");

    EXPECT_EQ(out.str(), "");
}