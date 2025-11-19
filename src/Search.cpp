#include "Search.h"
#include "ICompress.h"
#include "IO.h"
#include "Config.h"

#include <iostream>
#include <string>
#include <filesystem>
#include <sstream>
#include <fstream>

using namespace std;

void Search::execute() // it was no method of class
{
    std::string line = io->getLine();
    std::istringstream inStream(line);
    std::string text_to_search;
    inStream >> text_to_search;

    if (text_to_search.empty()) {
        return;
    }
        namespace fs = std::filesystem;

    //iterate through files in MY_FILES directory
    for (const auto &entry : filesystem::directory_iterator(MY_FILES)) {
        //check if entry is a regular file
        if (!entry.is_regular_file()) {
            continue;         
        }
        std::ifstream file(entry.path());
        std::string fileContent((std::istreambuf_iterator<char>(file)),
        std::istreambuf_iterator<char>());
        //decompress file content and search for the text (decoupling compression from searching)
        std::string content = compressor->decompress(fileContent);
        if (content.find(text_to_search) != std::string::npos) { // contains not in my version of cpp
            //print the file name if content found inside the file
            cout << entry.path().filename().string() << "\n";   
        }
    }
}
