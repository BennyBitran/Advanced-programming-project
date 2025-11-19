#include "Add.h"
#include "ICompress.h"
#include "IO.h"

#include <iostream>
#include <string>
#include <filesystem>

using namespace std;

Add::Add(ICompress* comp, IO* ioHandler) : compressor(comp), io(ioHandler) {}

void execute()
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
        string content = io->decompress(entry.path().string());
        if (content.contains(text_to_search)) {
            //print the file name if content found inside the file
            cout << entry.path().filename().string() << "\n";   
        }
    }
}
