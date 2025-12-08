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
        : command(cmd), line(rest), output("") {}

    string read() override {
        return command;
    }

    string getLine() const override {
        return line;
    }
    // make FakeIO::write same like CLIIO::write but store output in 'output' string
    void write(const string& s) const override {
        if (s.empty()) {
            return;
        }
        output += s + "\n";
    }
    void sendData(string content) override {
        output += "200 Ok\n\n" + content; // same like Socket_IO
    }
};

#endif
