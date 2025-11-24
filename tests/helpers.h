#include <filesystem>
#include <fstream>
#include "../src/Globals.h"
#include "FakeIO.h"
#include "FakeCompress.h"

using namespace std;    
void createTestDir(const std::string& dir);
FakeIO createFakeIO(const std::string&, const std::string&);
FakeCompress createFakeCompress(const std::string&);
