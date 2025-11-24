#include "helpers.h"
#include <filesystem>
#include <fstream>
#include "../src/Globals.h"

using namespace std;
void createTestDir(const string& dir) {
    filesystem::remove_all(dir); // Clean up before test
    filesystem::create_directory(dir); // Create test directory 
    MY_FILES = dir; // set global variable to point to test directory    
}
FakeIO createFakeIO(const string& command, const string& arguments) {
    return FakeIO(command, arguments);
}
FakeCompress createFakeCompress(const string& compressedContent) {
    return FakeCompress(compressedContent);

}