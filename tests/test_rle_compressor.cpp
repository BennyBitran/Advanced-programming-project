#include <gtest/gtest.h>
#include "RLECompressor.h"
// dummy for now
TEST(RLECompressorTest, EmptyStringRoundTrip) {
    RLECompressor c;
    std::string input = "";
    std::string encoded = c.compress(input);
    std::string decoded = c.decompress(encoded);
    EXPECT_EQ(decoded, input);
}

TEST(RLECompressorTest, SimpleRoundTrip) {
    RLECompressor c;
    std::string input = "aaabcc";
    std::string encoded = c.compress(input);
    std::string decoded = c.decompress(encoded);
    EXPECT_EQ(decoded, input);
}