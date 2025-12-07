#include "Get.h"
#include <iostream>
#include <sstream>
#include <filesystem>
#include <fstream>
#include <string>
#include "ICompress.h"
#include "IO.h"
#include "Globals.h"
#include "FilesystemExceptions.h"

using namespace std;

Get::Get(const ICompress& comp, IO& ioHandler, IFileSystem& fileSystem)
         : compressor(comp), io(ioHandler), fs(fileSystem) {} 

void Get::execute()
{
    //get the full command line (without the "get" part)
    string argument = io.getLine();
    
    //if there was more than one space - do nothing and move on
    if (!argument.empty() && argument[0] == ' ') {
        io.write("400 Bad Request");
        return; //throw exception later
    }

    //first argument should be the file name
    istringstream inStream(argument);
    string fileName;    
    inStream >> fileName;

    //save the rest of the line to check there was unwanted extra arguments
    string restOfLine;
    getline(inStream, restOfLine);

    //if no argument provided, or there are extra arguments - return
    if (fileName.empty() || !restOfLine.empty()) {
        io.write("400 Bad Request");
        return;
    }
    try {
        string compressed = fs.getFile(fileName);
        string content    = compressor.decompress(compressed);
        io.write("200 Ok\n");
        io.write(content);
    } catch (const FileNotFoundException&) {
        io.write("404 Not Found");
    } catch (const std::exception&) {
        io.write("500 Internal Server Error");
    }
}
