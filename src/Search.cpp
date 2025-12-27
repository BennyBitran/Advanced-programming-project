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

Search::Search(const ICompress& comp, IFileSystem& fileSystem)
         : compressor(comp), fs(fileSystem) {}  


void Search::execute(IO& io)
{
    // Read the entire line containing the text to search for
    string line = io.getLine();
    istringstream inStream(line);
    string text_to_search;
    getline(inStream, text_to_search);

    // If the search text is empty, return, the program keeps running to allow next commands
    if (text_to_search.empty()) {
        io.write("400 Bad Request");
        return;    
    }

    //iterate through files in MY_FILES directory
    string files_found;
    vector<string> files;
    try {
        files = fs.listFiles();
        } catch (const std::exception&) {
            io.write("500 Internal Server Error");
            return;
        }
    string decompressed_content;
    for (const string& file : files) {
        try {
        //check if file name matches text search, add it to results, no need to check content
        if (file.find(text_to_search) != string::npos) {
            files_found += (file + " ");
            continue;
        }
        //get the content of the file and decompress it
        try
        {
            decompressed_content = compressor.decompress(fs.getFile(file)); 
        }
        catch(const exception& e)
        {
            io.write("500 Internal Server Error");
        }

        //search for the text in the decompressed content
        if (decompressed_content.find(text_to_search) != string::npos) {
            files_found += (file + " ");
            }
        } catch (const FileNotFoundException&) {
            io.write("404 Not Found");
            return;
        } catch (const exception&) {
                io.write("500 Internal Server Error");
                return;
        }
    }
    if (!files_found.empty()) {
        files_found.pop_back(); // Removes the last space if any files were found
    }
    io.sendData(files_found); // can be empty
}
