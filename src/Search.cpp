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
    bool found = false;
    std::string line = io->getLine();
    std::istringstream inStream(line);
    std::string text_to_search;
    std::getline(inStream, text_to_search);

    if (!text_to_search.empty() && text_to_search[0] == ' ') {
        text_to_search.erase(0, 1);
}

    if (text_to_search.empty()) {
        return;
    }
    //iterate through files in MY_FILES directory
    for (const auto &entry : filesystem::directory_iterator(MY_FILES)) {
        //check if entry is a regular file
        if (!entry.is_regular_file()) {
            continue;         
        }
        std::ifstream fileStream(entry.path());
        std::stringstream buffer;
        buffer << fileStream.rdbuf();
        std::string compressed_content = buffer.str();
        std::string decompressed_content = compressor->decompress(compressed_content);
        if (decompressed_content.find(text_to_search) != std::string::npos) {
            io->write(entry.path().filename().string() + " ");
            found = true;
        }
    }
    if (found) {
    io->write("\n");
    }
}
