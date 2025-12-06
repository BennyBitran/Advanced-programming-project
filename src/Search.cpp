#include "Search.h"
#include "ICompress.h"
#include "IO.h"
#include "Globals.h"
#include "FilesystemExceptions.h"
#include <iostream>
#include <sstream>
#include <filesystem>
#include <fstream>
#include <string>
#include <vector>

using namespace std;

Search::Search(const ICompress& comp, IO& ioHandler, IFileSystem& fileSystem)
         : compressor(comp), io(ioHandler), fs(fileSystem) {}  


void Search::execute()
{
    // Read the entire line containing the text to search for
    string line = io.getLine();
    istringstream inStream(line);
    string text_to_search;
    getline(inStream, text_to_search);

    /*
    no need to remove leading space - CLI_IO already does that
    // Remove leading space if present 
    if (!text_to_search.empty() && text_to_search[0] == ' ') {
        text_to_search.erase(0, 1);
    }
    */

    // If the search text is empty, return, the program keeps running to allow next commands
    if (text_to_search.empty()) {
        io.write("400 Bad Request");
        return;    
    }

    //iterate through files in MY_FILES directory
    string files_found = "";
    try {
        for (const string& file : fs.listFiles()) {
            //check if file name matches text search, add it to results, no need to check content
            if (file.find(text_to_search) != string::npos) {
                files_found += (file + " ");
                continue;
            }
            //get the content of the file and decompress it
            string decompressed_content = compressor.decompress(fs.getFile(file)); 

            //search for the text in the decompressed content
            if (decompressed_content.find(text_to_search) != string::npos) {
                files_found += (file + " ");
            }
        }
    } catch (const FileNotFoundException&) {
        io.write("404 Not Found");
        return;
    } catch (const std::exception&) {
            io.write("400 Bad Request");
            return;
    }

        io.write("200 Ok\n");
        io.write(files_found); // can be empty
}

