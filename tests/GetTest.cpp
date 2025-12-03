#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>
#include "../src/Get.h"
#include "../src/Globals.h"
#include "FakeIO.h"
#include "FakeCompress.h"
#include "helpers.h"
#include "../src/FileManager.h"
using namespace std;




// Test that the Get command correctly reads a file, decompresses its content, and outputs it via the IO.
TEST(GetTest, OutputsDecompressedContent) {
    // Set up a temporary directory and create a test file with compressed content
    string dir = "test_dir_get";
    createTestDir(dir);
    string filePath = dir + "/file1";
    ofstream testFile(filePath);
    testFile << "FAKE_COMPRESSED"; // write fake compressed content
    testFile.close();

    // Set up FakeIO to simulate user input and capture output
    FakeIO io = createFakeIO("", "file1"); // simulate GET command with argument "file1"
    FakeCompress comp = createFakeCompress("hello world"); // simulate decompression output
    FileManager fs;
    Get get(comp, io, fs); // create Get command with fake components
    get.execute(); // execute the command

    // Verify that the output captured by FakeIO matches the expected decompressed content
    ASSERT_EQ(io.output, "hello world");
}

// Test that the Get command handles the case where the requested file does not exist.
TEST(GetTest, FileDoesNotExist) {
    string dir = "test_dir_get_no_file";
    createTestDir(dir);
    FakeIO io = createFakeIO("", "nonexistent_file"); // simulate GET command with non-existent file 
    FakeCompress comp = createFakeCompress(""); // decompression won't be called
    FileManager fs;
    Get get(comp, io, fs);
    get.execute();

    // Verify that the output indicates the file does not exist
    ASSERT_EQ(io.output, "");
}