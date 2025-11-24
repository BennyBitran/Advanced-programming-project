#include <gtest/gtest.h>
#include <sstream>
#include <filesystem>
#include <fstream>
#include "../src/App.h"
#include "../src/CLI_IO.h"
#include "../src/Add.h"
#include "../src/Get.h"
#include "../src/Search.h"
#include "../src/RLE.h"
#include "../src/Globals.h"

// Test for chain of logic without testingg App
// external linkage to modify global path
using
extern string MY_FILES;

class IntegrationTest : public ::testing::Test {
protected:
    string test_dir = "./test_integration_files";
    streambuf* original_cin;
    streambuf* original_cout;
    stringstream mock_input;
    stringstream mock_output;

    void SetUp() override {
        // setup filesystem
        if (filesystem::exists(test_dir)) {
            filesystem::remove_all(test_dir);
        }
        filesystem::create_directory(test_dir);
        MY_FILES = test_dir;

        // redirect cin and cout
        original_cin = cin.rdbuf(mock_input.rdbuf());
        original_cout = cout.rdbuf(mock_output.rdbuf());
    }

    void TearDown() override {
        // cleanup
        cin.rdbuf(original_cin);
        cout.rdbuf(original_cout);
        if (filesystem::exists(test_dir)) {
            filesystem::remove_all(test_dir);
        }
    }
};

// TEST 1: Basic Integration (Add -> File -> Get)
// this checks if real files are created and read correctly
TEST_F(IntegrationTest, FullFlow_AddAndGet) {
    // Prepare the input commands
    // 1. add file1 hello
    // 2. get file1
    // 3. loop will essentially exit when input stream ends/throws, handled by test env)
    
    // App loop is infinite, so we need a way to break it or run commands manually.
    //manually instantiate the commands and share the real IO/Compressor.
    
    CLI_IO real_io;
    RLE real_compressor;
    
    Add add_cmd(real_compressor, real_io);
    Get get_cmd(real_compressor, real_io);

    // execute ADD
    // simulate input for ADD
    mock_input << "file1 hello_world"; 
    add_cmd.execute();

    // check if file exists physically
    ASSERT_TRUE(filesystem::exists(test_dir + "/file1"));

    // step 2: Execute GET
    // simulate input for GET (filename)
    mock_input.str(""); // clear buffer
    mock_input.clear();
    mock_input << "file1"; 
    
    get_cmd.execute();

    // expect "hello_world" followed by newline from Get.cpp logic
    EXPECT_NE(mock_output.str().find("hello_world"), string::npos);
}

// TEST 2: compression steps ascii trick
// RLE writes counts as bytes. If count is 10, it writes '\n'.
// getline in Get.cpp will stop reading prematurely.
TEST_F(IntegrationTest, BinaryDataSafety_NewlineByte) {
    CLI_IO real_io;
    RLE real_compressor;
    
    Add add_cmd(real_compressor, real_io);
    Get get_cmd(real_compressor, real_io);

    // create a string that will result in a byte 10 (newline) in RLE
    // RLE writes [count][char].
    // we want count = 10. So we need 10 identical characters.
    string tricky_string = "AAAAAAAAAA"; // 10 'A's
    
    mock_input << "tricky_file " << tricky_string;
    add_cmd.execute();

    // try to GET it back
    mock_input.str(""); 
    mock_input.clear();
    mock_input << "tricky_file";
    
    get_cmd.execute();

    // uf Get.cpp uses getline, it might fail here because it hits the 10 byte
    // and thinks the line ended, returning incomplete data.
    EXPECT_NE(mock_output.str().find(tricky_string), string::npos) 
        << "Failed to retrieve string containing repeat count of 10 (newline byte)";
}

// TEST 3: Invalid Command Silence
// if command is considered invalid we need ignore it completely (no printing)
TEST_F(IntegrationTest, InvalidCommand_IsIgnoredSilently) {
    CLI_IO real_io;
    RLE real_compressor;
    
    
    Add add_cmd(real_compressor, real_io);
    
    // Case: Add with missing arguments (e.g. just "add")
    // The code in Add.cpp checks: if (fileName.empty() || fileData.empty()) return;
    mock_input << "only_filename_no_content"; 
    add_cmd.execute();
    
    // output should be empty
    EXPECT_EQ(mock_output.str(), "") << "Command should remain silent on invalid arguments";
}