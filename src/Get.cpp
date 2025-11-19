#include "Get.h"
#include <iostream>
#include <string>
#include "ICompress.h"
#include "IO.h"
#include <sstream>
#include <fstream>
#include <filesystem>

using namespace std;

Get::Get(ICompress* comp, IO* ioHandler) : compressor(comp), io(ioHandler) {}

void Get::execute()
{
    string inputline = io->getLine(); //updated name of varible bacause it was same for input and reading from file.
    istringstream inStream(inputline);
    string fileName;
    inStream >> fileName;
    //if no argument provided, return
    if (fileName.empty()) {
        return;
    }
    //construct full file path
    string file_full_path = MY_FILES + "/" + fileName;
    //save the rest of the line to check for unwanted extra arguments
    string restOfLine;
    getline(inStream, restOfLine);

    if (!filesystem::exists(file_full_path) || !restOfLine.empty()) {
        return;
    }

    std::ifstream fileStream(file_full_path);
    std::string line; //here was second line varible
    //read each line in file, decompress and print to cout
    while (std::getline(fileStream, line)) {
        std::cout << compressor->decompress(line) << "\n";
    }
    fileStream.close();
}