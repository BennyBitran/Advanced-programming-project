#include "FileManager.h"
#include <fstream>
#include <filesystem>
#include "Globals.h"
#include "FilesystemExceptions.h"
#include <vector>
#include <string>
#include <mutex>
#include <stdexcept>

using namespace std;

//we have a default constructor - no need to define it again

//return a vector of file names in MY_FILES directory
vector<string> FileManager::listFiles() {
    vector<string> files_names;
    files_lock.lock();
    try{
    //iterate through directory entries and collect file names into names vector
    for (const auto& entry : filesystem::directory_iterator(MY_FILES)) {
        if (entry.is_regular_file()) {
            files_names.push_back(entry.path().filename().string());
        }
    }
    files_lock.unlock();
    } 
    catch (const filesystem::filesystem_error& e){
        files_lock.unlock();
        throw runtime_error(string("Failed to list files: ") + e.what());
    }
    return files_names;
}
//return the content of the file with the given name (uncompressed)
string FileManager::getFile(const string& name) {
    
    files_lock.lock();
    //construct full file path
    string fullPath = MY_FILES + "/" + name;

    if (!filesystem::exists(fullPath)) {
        files_lock.unlock();    
        throw FileNotFoundException("File not found: " + name);
    }
    ifstream fileStream(fullPath, ios::binary); 
    if (!fileStream.is_open()) {
        files_lock.unlock();
        throw runtime_error("Failed to open file: " + name);
    }
    
    //read the entire file content and dump it all to a string named "content"
    string content((istreambuf_iterator<char>(fileStream)), istreambuf_iterator<char>());

    files_lock.unlock();
    
    return content;
}

//add a new file with the given name and data only if it doesnt already exist
void FileManager::addFile(const string& fileName, const string& data) {
    
    files_lock.lock();

    //construct full file path
    string file_full_path = MY_FILES + "/" + fileName;
    //check if file already exists - for now, if it does, we do nothing
    if (filesystem::exists(file_full_path)) {
        files_lock.unlock();
        throw FileExistsException("File already exists: " + fileName);
    }
    //create and open the file, write compressed data into it
    ofstream newFile(file_full_path);
    if (!newFile.is_open()) {
        files_lock.unlock();
        throw runtime_error("Failed to create file: " + fileName);
    }
    newFile << (data);
    newFile.close();
    files_lock.unlock();
    return;
}

//delete a file if it exists
void FileManager::deleteFile(const string& fileName) {
    lock_guard<mutex> lock(files_lock);

    string fullPath = MY_FILES + "/" + fileName;

    if (!filesystem::exists(fullPath)) {
        throw FileNotFoundException("File not found: " + fileName);
    }

    try {
        filesystem::remove(fullPath);
    } catch (const filesystem::filesystem_error& e) {
        // Any failure to remove is turned into runtime_error -> 500
        throw runtime_error(string("Failed to delete file: ") + e.what());
    }
}
