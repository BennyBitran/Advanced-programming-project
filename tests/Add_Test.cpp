#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../src/Add.h"
#include "Mocks.h"
#include <filesystem>
#include <fstream>

// external linkage to the global variable defined in globals.cpp
extern std::string MY_FILES;

class AddTest : public ::testing::Test {
protected:
    MockCompress mock_compressor;
    MockIO mock_io;
    std::string test_dir = "./test_files_add";

    void SetUp() override {
        // create a temporary directory for testing
        if (std::filesystem::exists(test_dir)) {
            std::filesystem::remove_all(test_dir);
        }
        std::filesystem::create_directory(test_dir);
        MY_FILES = test_dir; // redirect global path
    }

    void TearDown() override {
        // cleanup
        if (std::filesystem::exists(test_dir)) {
            std::filesystem::remove_all(test_dir);
        }
    }
};

using ::testing::Return;

TEST_F(AddTest, ExecuteCreatesFileWithCompressedContent) {
    // arrange
    Add add_cmd(&mock_compressor, &mock_io);
    
    // mock io to return " filename content"
    EXPECT_CALL(mock_io, getLine())
        .WillOnce(Return(" testfile.txt hello"));
    
    // mock compressor to return specific compressed data
    EXPECT_CALL(mock_compressor, compress("hello"))
        .WillOnce(Return("compressed_hello"));

    // act
    add_cmd.execute();

    // assert
    std::string full_path = test_dir + "/testfile.txt";
    EXPECT_TRUE(std::filesystem::exists(full_path));
    
    std::ifstream f(full_path);
    std::string content;
    f >> content;
    EXPECT_EQ(content, "compressed_hello");
}

TEST_F(AddTest, ExecuteDoesNothingIfFileExists) {
    // arrange
    std::string full_path = test_dir + "/existing.txt";
    std::ofstream f(full_path);
    f << "original";
    f.close();

    Add add_cmd(&mock_compressor, &mock_io);
    EXPECT_CALL(mock_io, getLine()).WillOnce(Return(" existing.txt newcontent"));
    
    // compress should NOT be called if logic checks existence first
    EXPECT_CALL(mock_compressor, compress(::testing::_)).Times(0);

    // act
    add_cmd.execute();

    // assert: file content should remain "original"
    std::ifstream f_read(full_path);
    std::string content;
    f_read >> content;
    EXPECT_EQ(content, "original");
}