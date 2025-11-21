#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../src/Search.h"
#include "Mocks.h"
#include <filesystem>
#include <fstream>

extern std::string MY_FILES;

class SearchTest : public ::testing::Test {
protected:
    MockCompress mock_compressor;
    MockIO mock_io;
    std::string test_dir = "./test_files_search";

    void SetUp() override {
        if (std::filesystem::exists(test_dir)) std::filesystem::remove_all(test_dir);
        std::filesystem::create_directory(test_dir);
        MY_FILES = test_dir;
    }

    void TearDown() override {
        if (std::filesystem::exists(test_dir)) std::filesystem::remove_all(test_dir);
    }
};

using ::testing::Return;

TEST_F(SearchTest, ExecuteFindsFileWithContent) {
    // arrange: create 2 files
    std::ofstream f1(test_dir + "/file1.txt"); f1 << "comp1"; f1.close();
    std::ofstream f2(test_dir + "/file2.txt"); f2 << "comp2"; f2.close();

    Search search_cmd(&mock_compressor, &mock_io);

    EXPECT_CALL(mock_io, getLine()).WillOnce(Return(" target"));

    // mock decompression behavior
    // warning: filesystem iteration order is not guaranteed NiceMock or allow multiple calls
    //to ensure deterministic test, we assume logic iterates all files
    EXPECT_CALL(mock_compressor, decompress("comp1")).WillRepeatedly(Return("this has target inside"));
    EXPECT_CALL(mock_compressor, decompress("comp2")).WillRepeatedly(Return("nothing here"));

    // assert: only file1 contains "target", so file1 should be printed
    // using testing::HasSubstr because implementation might add spaces
    EXPECT_CALL(mock_io, write(::testing::HasSubstr("file1.txt"))).Times(1);
    EXPECT_CALL(mock_io, write(::testing::HasSubstr("file2.txt"))).Times(0);
    EXPECT_CALL(mock_io, write("\n")).Times(1);

    // act
    search_cmd.execute();
}