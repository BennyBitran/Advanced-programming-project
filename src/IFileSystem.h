#ifndef IFILESYSTEM_H
#define IFILESYSTEM_H
#include <string>
#include <vector>

using namespace std;

class IFileSystem {

public:

    virtual vector<string> listFiles() = 0;

    // Throws std::runtime_error if file exists
    virtual string getFile(const string& name) = 0;

    virtual void addFile(const string& name, const string& data) = 0;

    // Throws std::runtime_error if file not found
    virtual void deleteFile(const string& name) = 0;

    virtual ~IFileSystem() = default;
};

#endif
