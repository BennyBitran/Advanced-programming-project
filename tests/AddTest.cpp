#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>
#include "../src/Add.h"
#include "../src/Globals.h"
#include "FakeIO.h"
#include "FakeCompress.h"

using namespace std;

TEST(AddTest, CreatesCompressedFile) {
    // here we set up a temporary directory for the test
    string dir = "./test_add";
    filesystem::remove_all(dir); // Clean up before test
    filesystem::create_directory(dir); // Create test directory
    MY_FILES = dir;

    // here we use FakeIO to simulate user input and FakeCompress to simulate compression
    FakeIO io("add", " file1 hello");   //add space since fake io doesnt handle the spacing format
    FakeCompress comp("FAKE_COMPRESSED");

    Add add(comp, io); // create Add command with fake components
    add.execute(); // let the magic begin

    string path = dir + "/file1"; // expected file path
    ASSERT_TRUE(filesystem::exists(path)); // check that file was created

    ifstream f(path); // open the created file to verify its contents
    string content; // read the content of the file into this string
    getline(f, content); // read the first line from the file

    ASSERT_EQ(content, "FAKE_COMPRESSED");
}