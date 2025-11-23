#include <gtest/gtest.h>
#include <sstream>
#include "../src/CLI_IO.h"

// Test that write() sends data to the provided output stream
TEST(IOTest, WriteTests) {
    std::istringstream in("");  // no input needed for this test because we are only testing output
    std::ostringstream out; // we will capture output here

    CLI_IO io(in, out);

    io.write("hello");
    io.write(" world");

    // Everything written should be in out.str()
    EXPECT_EQ(out.str(), "hello world");
}

// Test that read() and getLine() parse the command and the rest of the line, respectively
TEST(IOTest, ReadTests) {
    // This simulates a user typing:  add file1 hello world
    std::istringstream in("add file1 hello world");
    std::ostringstream out; // we don't care about output for this test

    CLI_IO io(in, out);

    std::string cmd  = io.read(); //should give us only the command
    std::string rest = io.getLine(); //should give us the rest of the line

    EXPECT_EQ(cmd, "add");

    EXPECT_EQ(rest, " file1 hello world"); // our implementation keeps the leading space, we take care of it later
}
// Test that read() and getLine() handle empty input correctly
TEST(IOTest, ReadHandlesEmptyInput) {
    // This simulates a user pressing enter without typing anything
    std::istringstream in("\n");
    std::ostringstream out;

    CLI_IO io(in, out);

    std::string cmd  = io.read();
    std::string rest = io.getLine();

    EXPECT_EQ(cmd, "");  // No command entered
    EXPECT_EQ(rest, ""); // No additional input
}
//test that multiple reads work correctly
TEST(IOTest, MultipleReadsWorkCorrectly) {
    // This simulates a user typing multiple commands
    std::istringstream in("first command line one\nsecond command line two\n");
    std::ostringstream out;

    CLI_IO io(in, out);

    std::string cmd1  = io.read();
    std::string rest1 = io.getLine();

    std::string cmd2  = io.read();
    std::string rest2 = io.getLine();

    EXPECT_EQ(cmd1, "first");
    EXPECT_EQ(rest1, " command line one");

    EXPECT_EQ(cmd2, "second");
    EXPECT_EQ(rest2, " command line two");
}