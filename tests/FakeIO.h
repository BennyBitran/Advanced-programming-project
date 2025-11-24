#ifndef FAKE_IO_H
#define FAKE_IO_H

#include "../src/IO.h"
#include <string>
using namespace std;
class FakeIO : public IO {
public:
    string command;       // returned by read()
    string line;      // returned by getLine()
    mutable std::string output; // collects write()

    FakeIO(const string& cmd, const string& rest)
        : command(cmd), line(rest) {}

    string read() override {
        return command;
    }

    string getLine() const override {
        return line;
    }

    void write(const string& s) const override {
        output += s;
    }
};

#endif
