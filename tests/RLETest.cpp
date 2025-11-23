#include <gtest/gtest.h>
#include "../src/RLE.h"
#include <string>
using namespace std;

// test fixture for rle compression
class RLETest : public ::testing::Test {
protected:
    RLE compressor;
};

// sanity test: compression logic
TEST_F(RLETest, CompressBasicString) {
    // arrange
    string input = "AAABBB";
    
    // act
    string compressed = compressor.compress(input);
    
    // assert
    // rle logic: 3 'A's -> char(3) + 'A'
    ASSERT_EQ(compressed.size(), 4); 
    EXPECT_EQ(compressed[0], (char)3);
    EXPECT_EQ(compressed[1], 'A');
    EXPECT_EQ(compressed[2], (char)3);
    EXPECT_EQ(compressed[3], 'B');
}

// sanity test: decompression logic
TEST_F(RLETest, DecompressBasicString) {
    // arrange
    string compressed = "";
    compressed.push_back((char)2);
    compressed.push_back('X');
    
    // act
    string decompressed = compressor.decompress(compressed);
    
    // assert
    EXPECT_EQ(decompressed, "XX");
}

// edge case test: empty string
TEST_F(RLETest, HandleEmptyString) {
    EXPECT_EQ(compressor.compress(""), "");
    EXPECT_EQ(compressor.decompress(""), "");
}