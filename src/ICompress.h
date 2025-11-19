#ifndef ICompress_H
#define ICompress_H

#include <string>

class ICompress
{
    public:

        virtual std::string compress(std::string) = 0;
        virtual std::string decompress(std::string) = 0;

        virtual ~ICompress() = default;
};
#endif
