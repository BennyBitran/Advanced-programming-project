#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>
#include <stdexcept>

#include "../src/Delete.h"
#include "../src/Globals.h"
#include "../src/IFileSystem.h"
#include "../src/FileManager.h"

#include "FakeIO.h"
#include "FakeCompress.h"
#include "helpers.h"

using namespace std;

// always throws runtime_error for delete
class ThrowingFileSystem : public IFileSystem {
public:
    vector<string> listFiles() override { return {}; }
    string getFile(const string&) override { return ""; }
    void addFile(const string&, const string&) override {}
    void deleteFile(const string&) override {
        throw runtime_error("boom");
    }
};

TEST(DeleteTest, DeleteExistingFileReturns204AndRemovesFile) {
    string dir = "test_dir_delete_existing";
    createTestDir(dir);

    string path = dir + "/file1";
    {
        ofstream f(path);
        f << "dummy";
    }

    FileManager fs;
    FakeIO io = createFakeIO("", "file1");             // argument: file name only

    Delete del(fs);
    del.execute(io);

    EXPECT_EQ(io.output, "204 No Content\n");
    EXPECT_FALSE(filesystem::exists(path));
}

TEST(DeleteTest, DeleteMissingFileReturns404) {
    string dir = "test_dir_delete_missing";
    createTestDir(dir);

    FileManager fs;
    FakeIO io = createFakeIO("", "ghost");

    Delete del(fs);
    del.execute(io);

    EXPECT_EQ(io.output, "404 Not Found\n");
}

TEST(DeleteTest, DeleteBadRequestOnMissingOrExtraArgs) {
    string dir = "test_dir_delete_bad_request";
    createTestDir(dir);

    FileManager fs;

    // If no argument
    FakeIO ioEmpty = createFakeIO("", "");
    Delete delEmpty(fs);
    delEmpty.execute(ioEmpty);
    EXPECT_EQ(ioEmpty.output, "400 Bad Request\n");

    // If extra arguments
    FakeIO ioExtra = createFakeIO("", "file1 extra");
    Delete delExtra(fs);
    delExtra.execute(ioExtra);
    EXPECT_EQ(ioExtra.output, "400 Bad Request\n");
}

TEST(DeleteTest, InternalErrorReturns500) {
    ThrowingFileSystem fs;
    FakeIO io = createFakeIO("", "file1");

    Delete del(fs);
    del.execute(io);

    EXPECT_EQ(io.output, "500 Internal Server Error\n");
}