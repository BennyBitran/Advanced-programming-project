#include "FileManager.h"
#include <fstream>
#include <filesystem>
#include "Globals.h"

using namespace std;

//we have a default constructor - no need to define it again

//return a vector of file names in MY_FILES directory
vector<string> FileManager::listFiles() {
    
    files_lock.lock();

    vector<string> files_names;
    //iterate through directory entries and collect file names into names vector
    for (const auto& entry : filesystem::directory_iterator(MY_FILES)) {
        if (entry.is_regular_file()) {
            files_names.push_back(entry.path().filename().string());
        }
    }

    files_lock.unlock();
    
    return files_names;
}
//return the content of the file with the given name
string FileManager::getFile(const string& name) {
    
    files_lock.lock();
    //construct full file path
    string fullPath = MY_FILES + "/" + name;

    ifstream fileStream(fullPath); 
    //read the entire file content and dump it all to a string named "content"
    string content((istreambuf_iterator<char>(fileStream)), istreambuf_iterator<char>());

    files_lock.unlock();
    
    return content;
}


void FileManager::addFile(const string& name, const string& data) {
    
    files_lock.lock();

    //construct full file path
    string file_full_path = MY_FILES + "/" + fileName;
    //check if file already exists - for now, if it does, we do nothing
    if (filesystem::exists(file_full_path)) {
        return;
    }
    //create and open the file, write compressed data into it
    ofstream newFile(file_full_path);
    newFile << (data);
    newFile.close();
    files_lock.unlock();
    return;
}
