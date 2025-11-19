#ifndef ICOMPRESS_H
#define ICOMPRESS_H

#include <string>

class ICompress
{
public:
    virtual std::string compress(std::string) = 0;
    virtual std::string decompress(std::string) = 0;
    virtual ~ICompress() = default;
};

#endif

//strings like #ifndef ICompress creates macros ICompress that after become class ICompress and after just class, and it will be error.
// its problem when #ifndef same with name of class. class and macros need to have dif names.