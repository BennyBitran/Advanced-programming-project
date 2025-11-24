#ifndef FAKE_IO_H
#define FAKE_IO_H

#include "../src/IO.h"
#include <string>

class FakeIO : public IO {
public:
    std::string command;       // returned by read()
    std::string line;      // returned by getLine()
    mutable std::string output; // collects write()

    FakeIO(const std::string& cmd, const std::string& rest)
        : command(cmd), line(rest) {}

    std::string read() override {
        return command;
    }

    std::string getLine() const override {
        return line;
    }

    void write(const std::string& s) const override {
        output += s;
    }
};

#endif
