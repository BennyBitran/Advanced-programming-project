#ifndef FILEMANAGER_H
#define FILEMANAGER_H

#include "IFileSystem.h"
#include <mutex>
#include <string>
#include <vector>
#include <filesystem>
#include <mutex>

using namespace std;
class FileManager : public IFileSystem {

public:

    FileManager() = default;

    vector<string> listFiles() override;

    string getFile(const string& name) override;

    void addFile(const string& name, const string& data) override;

private:
    mutex files_lock;

};

#endif
