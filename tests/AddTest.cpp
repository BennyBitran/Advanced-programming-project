#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>
#include "../src/Add.h"
#include "../src/Globals.h"
#include "FakeIO.h"
#include "FakeCompress.h"
#include "helpers.h"

using namespace std;




// test regular case where thr inptut is valid
TEST(AddTest, CreatesCompressedFile) {
    // here we set up a temporary directory for the test
    string dir = "test_dir_add";
    createTestDir(dir);

    FakeIO io = createFakeIO("", "file1 hello world"); // simulate ADD command with argument "file1
    FakeCompress comp = createFakeCompress("FAKE_COMPRESSED"); // simulate compression output

    Add add(comp, io); // create Add command with fake components
    add.execute(); // let the magic begin

    string path = dir + "/file1"; // expected file path
    ASSERT_TRUE(filesystem::exists(path)); // check that file was created

    ifstream f(path); // open the created file to verify its contents
    string content; // read the content of the file into this string
    getline(f, content); // read the first line from the file

    ASSERT_EQ(content, "FAKE_COMPRESSED");
}

// test case where no arguments are provided
TEST(AddTest, NoArgumentsProvided) {
    string dir = "test_dir_add_no_args";
    createTestDir(dir);
    FakeIO io = createFakeIO("", ""); // simulate ADD command with no arguments
    FakeCompress comp = createFakeCompress("FAKE_COMPRESSED"); // simulate compression output
    Add add(comp, io); // create Add command with fake components
    add.execute(); // execute the command
    ASSERT_TRUE(filesystem::is_empty(dir)); // check that no file was created
}

// test case where the input format is invalid, yaani extra spaces
TEST(AddTest, InvalidInputFormat) {
    string dir = "test_dir_add_invalid_input";
    createTestDir(dir);
    FakeIO io = createFakeIO("", " fileName hello"); // simulate ADD command with invalid input
    FakeCompress comp = createFakeCompress("FAKE_COMPRESSED"); // simulate compression output
    Add add(comp, io); // create Add command with fake components
    add.execute(); // execute the command
    string path = dir + "/fileName"; // expected file path
    ASSERT_FALSE(filesystem::exists(path)); // check that no file was created
}
