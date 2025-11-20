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
    bool found = false; // flag to check if any file matched

    // Read the entire line containing the text to search for
    string line = io->getLine();
    istringstream inStream(line);
    string text_to_search;
    getline(inStream, text_to_search);

    // Remove leading space if present 
    if (!text_to_search.empty() && text_to_search[0] == ' ') {
        text_to_search.erase(0, 1);
        
}

    // If the search text is empty, return immediately, because the program keeps running to allow next commands
    if (text_to_search.empty()) {
        return;
    }
    //iterate through files in MY_FILES directory
    for (const auto &entry : filesystem::directory_iterator(MY_FILES)) {
        //check if entry is a regular file
        if (!entry.is_regular_file()) {
            continue;         
        }

        
        ifstream fileStream(entry.path()); //open file
        stringstream buffer; //read file content into a stringstream
        
        //read the entire file content
        buffer << fileStream.rdbuf(); 
        string compressed_content = buffer.str(); 
        string decompressed_content = compressor->decompress(compressed_content); 

        ///search for the text in the decompressed content
        if (decompressed_content.find(text_to_search) != std::string::npos) {
            io->write(entry.path().filename().string() + " ");
            found = true;
        }
    }

    //print a newline if any file matched
    if (found) {
    io->write("\n");
    }
}
