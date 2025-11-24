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

Add::Add(const ICompress& comp, IO& ioHandler) : compressor(comp), io(ioHandler) {}  

void Add::execute() 
{
    string line = io.getLine();
    line = line.substr(1); // remove leading space
    
    //if there was more than one space, Hemi said the command is invalid, so we do nothing and move on with our program
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
    fileData = fileData.substr(1);  
    
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
    newFile << (compressor.compress(fileData));
    newFile.close();
}