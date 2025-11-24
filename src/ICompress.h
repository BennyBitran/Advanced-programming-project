#ifndef ICOMPRESS_H
#define ICOMPRESS_H

#include <string>
using namespace std;

class ICompress
{
    public:

        virtual string compress(const string&) const = 0;
        virtual string decompress(const string&) const = 0;

        virtual ~ICompress() = default;
};
#endif
