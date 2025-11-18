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
    string file_name = MY_FILES + "/" + file_name;
    if (filesystem::exists(file_name)) {
        return;
    }
    std::ofstream newFile(file_name);
    newFile << (compressor->compress(fileData));
    newFile.close();
}