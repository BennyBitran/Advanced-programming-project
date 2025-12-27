#include <gtest/gtest.h>
#include <sstream>
#include <filesystem>
#include <fstream>
#include <string>

#include "../src/App.h"
#include "../src/CLI_IO.h"
#include "../src/Add.h"
#include "../src/Get.h"
#include "../src/Search.h"
#include "../src/RLE.h"
#include "../src/Globals.h"
#include "../src/FileManager.h"


// Test for chain of logic without testingg App
// external linkage to modify global path
using namespace std;
extern string MY_FILES;

class IntegrationTest : public ::testing::Test {
protected:
    string test_dir = "./test_integration_files";
    stringstream mock_input;
    stringstream mock_output;

    void SetUp() override {
        // setup filesystem
        if (filesystem::exists(test_dir)) {
            filesystem::remove_all(test_dir);
        }
        filesystem::create_directory(test_dir);
        MY_FILES = test_dir;
    }

    void TearDown() override {
        // cleanup
        if (filesystem::exists(test_dir)) {
            filesystem::remove_all(test_dir);
        }
    }
};

// TEST 1: Full loop (Add -> creation of File -> Get -> reading)
// this checks if real files are created and read correctly
TEST_F(IntegrationTest, FullFlow_AddAndGet) {
    //manually instantiate the commands and share the real IO/Compressor.
    //using streams of cli io for input output
    CLI_IO real_io(mock_input, mock_output);
    RLE real_compressor;
    FileManager fs;
    // real dependecies
    Add add_cmd(real_compressor, fs);
    Get get_cmd(real_compressor, fs);

    // execute ADD
    // simulate input for ADD
    mock_input << "add file1 hello_world"; 
    real_io.read();
    add_cmd.execute(real_io);

    // check if file exists physically
    ASSERT_TRUE(filesystem::exists(test_dir + "/file1"));

    // step 2: Execute GET
    // simulate input for GET (filename)
    mock_input.str(""); // clear buffer
    mock_input.clear();
    mock_input << "get file1\n"; 
    real_io.read();
    get_cmd.execute(real_io);

    // expect "hello_world" followed by newline from Get.cpp logic
    EXPECT_NE(mock_output.str().find("hello_world\n"), string::npos);
}

// TEST 2: compression steps ascii trick
// RLE writes counts as bytes. If count is 10, it writes '\n'.
// getline in Get.cpp will stop reading prematurely.
TEST_F(IntegrationTest, BinaryDataSafety_NewlineByte) {

    CLI_IO real_io(mock_input, mock_output);
    RLE real_compressor;
    FileManager fs;
    // real dependecies
    Add add_cmd(real_compressor, fs);
    Get get_cmd(real_compressor, fs);

    // create a string that will result in a byte 10 (newline) in RLE
    // RLE writes [count][char].
    // we want count = 10. So we need 10 identical characters.
    string tricky_string = "AAAAAAAAAA"; // 10 'A's
    
    mock_input << "add tricky_file " << tricky_string;
    real_io.read();
    add_cmd.execute(real_io);

    // try to GET it back
    mock_input.str(""); 
    mock_input.clear();
    mock_input << "git tricky_file";
    real_io.read();
    get_cmd.execute(real_io);

    // uf Get.cpp uses getline, it might fail here because it hits the 10 byte
    // and thinks the line ended, returning incomplete data.
    EXPECT_NE(mock_output.str().find(tricky_string), string::npos) 
        << "Failed to retrieve string containing repeat count of 10 (newline byte)";
}

// TEST 3: Invalid Command Silence
// if command is considered invalid we need ignore it completely (no printing)
TEST_F(IntegrationTest, InvalidCommand_IsIgnoredSilently) {

    CLI_IO real_io(mock_input, mock_output);
    RLE real_compressor;
    FileManager fs;
    
    Add add_cmd(real_compressor, fs);
    
    // Case: Add with missing arguments (e.g. just "add")
    // The code in Add.cpp checks: if (fileName.empty() || fileData.empty()) return;
    mock_input << "add only_filename_no_content"; 
    add_cmd.execute(real_io);
    // new logic
    EXPECT_EQ(mock_output.str(), "400 Bad Request\n")
    << "Invalid ADD arguments should return 400 Bad Request";
}