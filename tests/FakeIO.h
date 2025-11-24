#ifndef FAKE_IO_H
#define FAKE_IO_H

#include "../src/IO.h"
#include <string>

class FakeIO : public IO {
public:
    std::string cmd;       // returned by read()
    std::string args;      // returned by getLine()
    mutable std::string output; // collects write()

    FakeIO(const std::string& c, const std::string& a)
        : cmd(c), args(a) {}

    std::string read() override {
        return cmd;
    }

    std::string getLine() const override {
        return args;
    }

    void write(const std::string& s) const override {
        output += s;
    }
};

#endif
