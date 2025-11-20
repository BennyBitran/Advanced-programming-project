#include "Search.h"
#include "ICompress.h"
#include "IO.h"
#include "Globals.h"
#include <iostream>
#include <sstream>
#include <filesystem>
#include <fstream>
#include <string>

using namespace std;

Search::Search(ICompress* comp, IO* ioHandler) : compressor(comp), io(ioHandler) {}

void Search::execute()
{
    std::string line = io->getLine();
    std::istringstream inStream(line);
    std::string text_to_search;
    inStream >> text_to_search;

    if (text_to_search.empty()) {
        return;
    }
    //iterate through files in MY_FILES directory
    for (const auto &entry : filesystem::directory_iterator(MY_FILES)) {
        //check if entry is a regular file
        if (!entry.is_regular_file()) {
            continue;         
        }
        //decompress file content and search for the text (decoupling compression from searching)
        string content = compressor->decompress(entry.path().string());
        //check if text_to_search is in content
        if (content.find(text_to_search) != string::npos) {
            //print the file name if content found inside the file
            io->write(entry.path().filename().string() + " ");   
        }
    }
    io->write("\n");
}
