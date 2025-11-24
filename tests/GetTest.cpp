#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>
#include "../src/Get.h"
#include "../src/Globals.h"
#include "FakeIO.h"
#include "FakeCompress.h"
using namespace std;
// Test that the Get command correctly reads a file, decompresses its content, and outputs it via the IO handler.
TEST(GetTest, OutputsDecompressedContent) {
    string dir = "./test_get";
    filesystem::remove_all(dir);
    filesystem::create_directory(dir);
    MY_FILES = dir;

    ofstream f(dir + "/myfile");
    f << "XYZ";
    f.close();

    FakeIO io("get", " myfile");
    FakeCompress comp("DECOMP");

    Get get(comp, io);
    get.execute();

    ASSERT_EQ(io.output, "DECOMP\n");
}
