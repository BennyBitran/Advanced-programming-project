#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>
#include "../src/Add.h"
#include "../src/Globals.h"
#include "FakeIO.h"
#include "FakeCompress.h"


TEST(AddTest, CreatesCompressedFile) {
    // here we set up a temporary directory for the test
    std::string dir = "./test_add";
    std::filesystem::remove_all(dir); // Clean up before test
    std::filesystem::create_directory(dir); // Create test directory
    MY_FILES = dir;

    // here we use FakeIO to simulate user input and FakeCompress to simulate compression
    FakeIO io("add", "file1 hello");
    FakeCompress comp("FAKE_COMPRESSED");

    Add add(comp, io); // create Add command with fake components
    add.execute(); // let the magic begin

    std::string path = dir + "/file1"; // expected file path
    ASSERT_TRUE(std::filesystem::exists(path)); // check that file was created

    std::ifstream f(path); // open the created file to verify its contents
    std::string content; // read the content of the file into this string
    std::getline(f, content); // read the first line from the file

    ASSERT_EQ(content, "FAKE_COMPRESSED");
}
