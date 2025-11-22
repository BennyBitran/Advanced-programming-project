#include "Get.h"
#include <iostream>
#include <sstream>
#include <filesystem>
#include <fstream>
#include <string>

#include "ICompress.h"
#include "IO.h"
#include "Globals.h"
using namespace std;

Get::Get(ICompress* comp, IO* ioHandler) : compressor(comp), io(ioHandler) {}

void Get::execute()
{
    //get the full command line (without the "get" part)
    string argument = io->getLine();
    istringstream inStream(argument);
    string fileName;    //first argument should be the file name
    inStream >> fileName;
    //if no argument provided, return
    if (fileName.empty()) {
        return;
    }
    //construct full file path
    string file_full_path = MY_FILES + "/" + fileName;
    //save the rest of the line to check there was unwanted extra arguments
    string restOfLine;
    getline(inStream, restOfLine);
    //if file does not exist or there are extra arguments, return
    if (!filesystem::exists(file_full_path) || !restOfLine.empty()) {
        return;
    }
    //open the file for reading
    ifstream fileStream(file_full_path);    
    //read the entire file content and dump it all to a string named "content"
    string content((istreambuf_iterator<char>(fileStream)), istreambuf_iterator<char>());
    //decompress content and send to io for output
    io->write(compressor->decompress(content) + "\n");
    fileStream.close();
}
