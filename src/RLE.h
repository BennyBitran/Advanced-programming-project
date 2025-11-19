#ifndef RLE_H
#define RLE_H
#include "ICompress.h"

#include <string>

class RLE : public ICompress
{
    public:
        RLE() = default;

        virtual std::string compress(const std::string) override;
        virtual std::string decompress(const std::string) override;

        virtual ~RLE() = default;
};
#endif
