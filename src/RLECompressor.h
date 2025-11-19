#ifndef RLECOMPRESSOR_H
#define RLECOMPRESSOR_H

#include "ICompress.h"
#include <string>
class RLECompressor : public ICompress {
public:
    std::string compress(std::string input) override;
    std::string decompress(std::string input) override;

    virtual ~RLECompressor() = default;
};

#endif