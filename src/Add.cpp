#include "Add.h"
#include "Globals.h"
#include "ICompress.h"
#include "IO.h"
#include "FilesystemExceptions.h"
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
        io.write("400 Bad Request");
        return; // no arguments provided
    }
    
    //if the first char is a space, that means there were at least two spaces after the command, and Hemi said this is invalid, so we do nothing and move on with our program
    if (!line.empty() && line[0] == ' ') {
        io.write("400 Bad Request");
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
        io.write("400 Bad Request");
        return; //add exception throw
    }
    //add the file to the file system
    try {
        fs.addFile(fileName, compressor.compress(fileData));
        io.write("201 Created");
    } catch (const FileExistsException&) {
        io.write("400 Bad Request");
    } catch (const std::exception&) {
        // every other exception
        io.write("400 Bad Request");
    }
}