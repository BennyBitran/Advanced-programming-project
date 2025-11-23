#ifndef ICOMPRESS_H
#define ICOMPRESS_H

#include <string>

class ICompress
{
    public:

        virtual std::string compress(const std::string&) const = 0;
        virtual std::string decompress(const std::string&) const = 0;

        virtual ~ICompress() = default;
};
#endif
