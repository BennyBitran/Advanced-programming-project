#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>
#include <sstream>

#include "Add.h"
#include "Get.h"
#include "Search.h"
#include "Config.h"
#include "ICompress.h"
#include "IO.h"

namespace fs = std::filesystem;

// fake compressor to test 
class FakeCompressor : public ICompress {
public:
    std::string lastCompressed;
    std::string lastDecompressed;

    std::string compress(std::string s) override {
        lastCompressed = s;
        return "C:" + s;
    }

    std::string decompress(std::string s) override {
        lastDecompressed = s;
        if (s.rfind("C:", 0) == 0) {
            return s.substr(2);
        }
        return s;
    }
};

// fake io IO
class FakeIO : public IO {
public:
    std::string lineToReturn;

    mutable std::vector<std::string> written;

    std::string getLine() override { return lineToReturn; }

    std::string read() override { return {}; }

    void write(std::string& s) const override {
        written.push_back(s);
    }
};
//test for add
TEST(AddCommandTest, CreatesFileWithCompressedContent) {
    FakeCompressor comp;
    FakeIO io;

    // string how user writes it
    io.lineToReturn = "testfile.txt hello_world";

    // dir wirth files
    fs::create_directories(MY_FILES);
    fs::path path = fs::path(MY_FILES) / "testfile.txt";
    fs::remove(path);

    Add cmd(&comp, &io);
    cmd.execute();

    ASSERT_TRUE(fs::exists(path));

    std::ifstream f(path);
    std::string content;
    std::getline(f, content);

    // check that its realy that compressor returned 
    EXPECT_EQ(content, comp.compress(" hello_world"));
}
//test for get
TEST(GetCommandTest, PrintsDecompressedContentToStdout) {
    FakeCompressor comp;
    FakeIO io;

    fs::create_directories(MY_FILES);
    fs::path path = fs::path(MY_FILES) / "getfile.txt";
    fs::remove(path);

    // first file with compressed value
    std::string original = " hello_from_get";
    {
        std::ofstream f(path);
        f << comp.compress(original) << "\n";
    }

    io.lineToReturn = "getfile.txt";

    // redirect cout
    std::ostringstream buffer;
    auto* oldBuf = std::cout.rdbuf(buffer.rdbuf());

    Get cmd(&comp, &io);
    cmd.execute();

    std::cout.rdbuf(oldBuf); // return old buffer

    std::string output = buffer.str();
    EXPECT_EQ(output, original + "\n");
}

//test for search
TEST(SearchCommandTest, PrintsMatchingFileNames) {
    FakeCompressor comp;
    FakeIO io;

    fs::create_directories(MY_FILES);

    fs::path file1 = fs::path(MY_FILES) / "a.txt";
    fs::path file2 = fs::path(MY_FILES) / "b.txt";

    {
        std::ofstream f1(file1);
        f1 << comp.compress("hello world") << "\n";
        std::ofstream f2(file2);
        f2 << comp.compress("nothing here") << "\n";
    }

    io.lineToReturn = "hello";

    std::ostringstream buffer;
    auto* oldBuf = std::cout.rdbuf(buffer.rdbuf());

    Search cmd(&comp, &io);
    cmd.execute();

    std::cout.rdbuf(oldBuf);

    std::string out = buffer.str();
    // expecting will return a.txt only for now
    EXPECT_EQ(out, "a.txt\n");
}