#include "Add.h"
#include "Globals.h"
#include "ICompress.h"
#include "IO.h"
#include <iostream>
#include <sstream>
#include <filesystem>
#include <fstream>
#include <string>
#include "IFileSystem.h"

using namespace std;

Add::Add(const ICompress& comp, IO& ioHandler, IFileSystem& fileSystem)
         : compressor(comp), io(ioHandler), fs(fileSystem) {}  

void Add::execute() 
{
    string line = io.getLine();
    if (line.empty()) {
        return; // no arguments provided
    }
    
    //if the first char is a space, that means there were at least two spaces after the command, and Hemi said this is invalid, so we do nothing and move on with our program
    if (!line.empty() && line[0] == ' ') {
        return;
    }
    istringstream inStream(line);
    string fileName;
    inStream >> fileName;
    //read the rest of the line as file data
    string fileData;
    getline(inStream, fileData);
    //remove leading space. if it wasnt a space - it would have been in fileName (so its safe)
    if (!fileData.empty()){
    fileData = fileData.substr(1);  
    }
    
    if (fileName.empty() || fileData.empty()) {
        return; //add exception throw
    }
    //add the file to the file system
    try {
        fs.addFile(fileName, compressor.compress(fileData));
    }
    catch (...) {
        //handle exceptions when we add exceptions 
    }
}