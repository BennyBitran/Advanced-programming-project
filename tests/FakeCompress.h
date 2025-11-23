#ifndef FAKE_COMPRESS_H
#define FAKE_COMPRESS_H

#include "../src/ICompress.h"
#include <string>

class FakeCompress : public ICompress {
public:
    std::string fake;

    FakeCompress(const std::string& f)
        : fake(f) {}

    std::string compress(const std::string& in) const override {
        return fake;
    }

    std::string decompress(const std::string& in) const override {
        return fake;
    }
};

#endif
