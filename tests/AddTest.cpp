#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>
#include "../src/Add.h"
#include "../src/Globals.h"
#include "FakeIO.h"
#include "FakeCompress.h"


TEST(AddTest, CreatesCompressedFile) {
    std::string dir = "./test_add";
    std::filesystem::remove_all(dir);
    std::filesystem::create_directory(dir);
    MY_FILES = dir;

    FakeIO io("add", "file1 hello");
    FakeCompress comp("FAKE_COMPRESSED");

    Add add(comp, io);
    add.execute();

    std::string path = dir + "/file1";
    ASSERT_TRUE(std::filesystem::exists(path));

    std::ifstream f(path);
    std::string content;
    std::getline(f, content);

    ASSERT_EQ(content, "FAKE_COMPRESSED");
}
