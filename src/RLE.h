#ifndef RLE_H
#define RLE_H
#include "ICompress.h"

#include <string>

class RLE : public ICompress
{
    public:
        RLE();

        virtual std::string compress(std::string) override;
        virtual std::string decompress(std::string) override;

        virtual ~RLE() = default;
};
#endif
