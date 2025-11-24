#ifndef RLE_H
#define RLE_H
#include "ICompress.h"

#include <string>
using namespace std;

class RLE : public ICompress
{
    public:
        RLE();

        virtual string compress(const string&) const override;
        virtual string decompress(const string&) const override;

        virtual ~RLE() = default;
};
#endif
