#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>

#include "../src/Search.h"
#include "../src/Globals.h"
#include "../src/RLE.h"

#include "FakeIO.h"
#include "helpers.h"
#include "../src/FileManager.h"

using namespace std;

// Test that the Search command correctly finds and outputs filenames containing the search term.
TEST(SearchTest, FindsAndOutputsMatchingFilenames) {
    // Set up a temporary directory and create test files
    string dir = "test_dir_search";
    createTestDir(dir);
    RLE comp; // using real RLE compressor for this test

    ofstream file1(dir + "/apple.txt");
    file1 << comp.compress("This is a file about apples.");
    file1.close();
    ofstream file2(dir + "/banana.txt");
    file2 << comp.compress("banans are yummy.");
    file2.close();
    ofstream file3(dir + "/tapuz.txt");
    file3 << comp.compress("haruz tapuz.");
    file3.close();
    // Set up FakeIO to simulate user input and capture output
    FakeIO io = createFakeIO("", "ap"); // simulate SEARCH command with argument "ap"
    FileManager fs;
    Search search(comp, fs); // create Search command with real compressor and fake IO
    search.execute(io); // execute the command
    // Verify that the output captured by FakeIO contains the expected filenames
    ASSERT_NE(io.output.find("apple.txt"), string::npos); // should find apple.txt
    ASSERT_NE(io.output.find("tapuz.txt"), string::npos); // should find tapuz.txt
    ASSERT_EQ(io.output.find("banana.txt"), string::npos); // should NOT find banana.txt
}

// Test that the Search command handles the case where no filenames match the search term.
TEST(SearchTest, NoMatchingFilenames) {
    string dir = "test_dir_search_no_match";
    createTestDir(dir);
    RLE comp; // again, using real RLE, we tested it extensively elsewhere
    ofstream file1(dir + "/orange.txt");
    file1 << comp.compress("Just some content.");
    file1.close();
    FakeIO io = createFakeIO("", "xyz"); // simulate SEARCH command with non-matching argument
    FileManager fs;
    Search search(comp, fs);
    search.execute(io);
    // Verify that the output indicates no matches found
    // for part 2
    EXPECT_EQ(io.output, "200 Ok\n\n");
}