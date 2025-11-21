#include <gtest/gtest.h>
#include "../src/CLI_IO.h"
#include <sstream>

// test fixture for cli_io
class CLI_IOTest : public ::testing::Test {
protected:
    CLI_IO cli_io;
    std::stringstream mock_input;
    std::stringstream mock_output;
    std::streambuf* original_cin;
    std::streambuf* original_cout;

    void SetUp() override {
        // redirect std::cin and std::cout to stringstreams
        original_cin = std::cin.rdbuf(mock_input.rdbuf());
        original_cout = std::cout.rdbuf(mock_output.rdbuf());
    }

    void TearDown() override {
        // restore std::cin and std::cout
        std::cin.rdbuf(original_cin);
        std::cout.rdbuf(original_cout);
    }
};

// test parsing the command name (first word)
TEST_F(CLI_IOTest, ReadParsesCommandCorrectly) {
    mock_input << "add myfile.txt content";
    std::string cmd = cli_io.read();
    EXPECT_EQ(cmd, "add");
}

// test getting the rest of the line
TEST_F(CLI_IOTest, GetLineReturnsRestOfInput) {
    mock_input << "add myfile.txt content";
    cli_io.read(); // consumes "add"
    std::string args = cli_io.getLine();
    
    // cli_io implementation usually keeps the leading space or trims it depending on logic
    // based on provided code: getline(ss, this->line) keeps the leading space if using >>
    // let's verify the exact behavior
    EXPECT_EQ(args, " myfile.txt content"); 
}

// test writing to standard output
TEST_F(CLI_IOTest, WriteOutputsToStdOut) {
    cli_io.write("Hello World");
    EXPECT_EQ(mock_output.str(), "Hello World");
}