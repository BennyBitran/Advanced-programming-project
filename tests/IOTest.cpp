#include <gtest/gtest.h>
#include <sstream>
#include "../src/CLI_IO.h"

TEST(IOTest, WritePrintsToStdout) {
    CLI_IO io;

    testing::internal::CaptureStdout();
    io.write("hello");
    std::string out = testing::internal::GetCapturedStdout();

    ASSERT_EQ(out, "hello");
}

TEST(IOTest, ReadParsesCommandAndArgs) {
    CLI_IO io;

    std::istringstream fakeInput("add file1 hello world\n");
    std::streambuf* oldCin = std::cin.rdbuf(fakeInput.rdbuf());

    std::string cmd = io.read();
    std::string rest = io.getLine();

    std::cin.rdbuf(oldCin);

    ASSERT_EQ(cmd, "add");
    ASSERT_EQ(rest, " file1 hello world");
}
