#include "Add.h"
#include <iostream>
#include <string>
#include "ICompress.h"
#include "IO.h"
#include <sstream>
#include <filesystem>
#include <fstream>
#include "Constants.h"

using namespace std;
using namespace std::filesystem;
Add::Add(ICompress* comp, IO* ioHandler) : compressor(comp), io(ioHandler) {}  

void Add::execute()
{
    std::string line = io->getLine();
    std::istringstream inStream(line);
    std::string fileName;
    inStream >> fileName;
    //read the rest of the line as file data
    string fileData;
    std::getline(inStream, fileData);
    
    if (fileName.empty() || fileData.empty()) {
        return;
    }
    //construct full file path
    string file_full_path = MY_FILES + "/" + fileName;
    //check if file already exists - for now, if it does, we do nothing
    if (filesystem::exists(file_full_path)) {
        return;
    }
    //create and open the file, write compressed data into it
    std::ofstream newFile(file_full_path);
    newFile << (compressor->compress(fileData));
    newFile.close();
}