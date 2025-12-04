#ifndef FILESYSTEM_EXCEPTIONS_H
#define FILESYSTEM_EXCEPTIONS_H

#include <stdexcept>
#include <string>

// Error file already exist POST - 400
class FileExistsException : public std::runtime_error {
public:
    FileExistsException(const std::string& msg = "File already exists") 
        : std::runtime_error(msg) {}
};

// Error file not found DELETE/GET - 404
class FileNotFoundException : public std::runtime_error {
public:
    FileNotFoundException(const std::string& msg = "File not found") 
        : std::runtime_error(msg) {}
};

#endif