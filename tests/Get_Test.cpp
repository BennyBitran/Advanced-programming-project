#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../src/Get.h"
#include "Mocks.h"
#include <filesystem>
#include <fstream>

extern std::string MY_FILES;

class GetTest : public ::testing::Test {
protected:
    MockCompress mock_compressor;
    MockIO mock_io;
    std::string test_dir = "./test_files_get";

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

TEST_F(GetTest, ExecutePrintsDecompressedContent) {
    // arrange
    // create a dummy compressed file
    std::ofstream f(test_dir + "/data.bin");
    f << "compressed_data";
    f.close();

    Get get_cmd(&mock_compressor, &mock_io);

    EXPECT_CALL(mock_io, getLine()).WillOnce(Return(" data.bin"));
    EXPECT_CALL(mock_compressor, decompress("compressed_data"))
        .WillOnce(Return("original_text"));
    
    // expect write to be called with decompressed text + newline
    EXPECT_CALL(mock_io, write("original_text\n")).Times(1);

    // act
    get_cmd.execute();
}

TEST_F(GetTest, ExecuteIgnoresNonExistentFile) {
    Get get_cmd(&mock_compressor, &mock_io);
    EXPECT_CALL(mock_io, getLine()).WillOnce(Return(" ghost.txt"));
    
    // should not attempt decompression or writing
    EXPECT_CALL(mock_compressor, decompress(::testing::_)).Times(0);
    EXPECT_CALL(mock_io, write(::testing::_)).Times(0);

    get_cmd.execute();
}