#include "Add.h"
#include <iostream>
#include <string>
#include "ICompress.h"
#include "IO.h"

using namespace std;
Add::Add(ICompress* comp, IO* ioHandler) : compressor(comp), io(ioHandler) {}  

void Add::execute()
{
    std::string line = io->getLine();
    std::istringstream inStream(line);
    std::string fileName;
    inStream >> fileName;

    string fileData;
    std::getline(inStream, fileData);
    
    if (fileName.empty() || fileData.empty()) {
        return;
    }
    string file_full_path = MY_FILES + "/" + fileName;
    if (filesystem::exists(file_full_path)) {
        return;
    }
    std::ofstream newFile(file_full_path);
    newFile << (compressor->compress(fileData));
    newFile.close();
}