#ifndef RLE_H
#define RLE_H
#include "ICompress.h"

#include <string>

class RLE : public ICompress
{
    public:
        RLE();

        virtual std::string compress(const std::string&) const override;
        virtual std::string decompress(const std::string&) const override;

        virtual ~RLE() = default;
};
#endif
