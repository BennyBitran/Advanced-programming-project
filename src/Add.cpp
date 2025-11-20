#include "Add.h"
#include "Globals.h"
#include "ICompress.h"
#include "IO.h"
#include <iostream>
#include <sstream>
#include <filesystem>
#include <fstream>
#include <string>

using namespace std;

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
    ofstream newFile(file_full_path);
    newFile << (compressor->compress(fileData.substr(1))); //substr(1) to remove leading space
    newFile.close();
}