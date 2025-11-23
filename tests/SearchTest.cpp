#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>

#include "../src/Search.h"
#include "../src/Globals.h"
#include "../src/RLE.h"

#include "FakeIO.h"

class SearchTest : public ::testing::Test {
protected:
    std::string dir;
    RLE compressor;

    void SetUp() override {
        dir = "./test_search_no_helper";
        std::filesystem::remove_all(dir);
        std::filesystem::create_directory(dir);
        MY_FILES = dir;
    }

    void TearDown() override {
        std::filesystem::remove_all(dir);
    }
};

// --------------------------------------------------------
// 1. No files present
// --------------------------------------------------------
TEST_F(SearchTest, NoFiles_NoOutput) {
    FakeIO io("search", "hello");
    Search search(compressor, io);

    search.execute();

    EXPECT_EQ(io.output, "");
}

// --------------------------------------------------------
// 2. One file: match
// --------------------------------------------------------
TEST_F(SearchTest, SingleFile_Match) {
    // Create file containing COMPRESSED "hello world"
    {
        std::ofstream f(dir + "/file1");
        std::string compressed = compressor.compress("hello world");
        f << compressed;
    }

    FakeIO io("search", "hello");
    Search search(compressor, io);

    search.execute();

    EXPECT_EQ(io.output, "file1 \n");
}

// --------------------------------------------------------
// 3. One file: no match
// --------------------------------------------------------
TEST_F(SearchTest, SingleFile_NoMatch) {
    {
        std::ofstream f(dir + "/file1");
        std::string compressed = compressor.compress("goodbye");
        f << compressed;
    }

    FakeIO io("search", "hello");
    Search search(compressor, io);

    search.execute();

    EXPECT_EQ(io.output, "");
}

// --------------------------------------------------------
// 4. Several files: some match, some don’t
// --------------------------------------------------------
TEST_F(SearchTest, MultipleFiles_SomeMatch) {
    {
        std::ofstream f(dir + "/f1");
        f << compressor.compress("hello there");
    }
    {
        std::ofstream f(dir + "/f2");
        f << compressor.compress("nothing relevant");
    }
    {
        std::ofstream f(dir + "/f3");
        f << compressor.compress("oh hello again");
    }

    FakeIO io("search", "hello");
    Search search(compressor, io);
    search.execute();

    std::string out = io.output;

    // Check f1 and f3 are printed
    EXPECT_NE(out.find("f1 "), std::string::npos);
    EXPECT_NE(out.find("f3 "), std::string::npos);

    // Check f2 is NOT printed
    EXPECT_EQ(out.find("f2 "), std::string::npos);

    // Output must end with newline (because at least one match exists)
    EXPECT_EQ(out.back(), '\n');
}

// --------------------------------------------------------
// 5. File decompresses to empty string
// --------------------------------------------------------
TEST_F(SearchTest, EmptyFile_NoMatchForNonEmptyQuery) {
    {
        std::ofstream f(dir + "/empty");
        f << compressor.compress("");
    }

    FakeIO io("search", "hello");
    Search search(compressor, io);
    search.execute();

    EXPECT_EQ(io.output, "");
}
