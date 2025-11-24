#ifndef CLI_IO_H
#define CLI_IO_H
#include "IO.h"

#include <iostream>
#include <string>
using namespace std;

class CLI_IO : public IO
{
    private:
    
        string line;
        istream& input;
        ostream& output;

    public:
        //default constructor (input from cin and output to cout)
        CLI_IO();

        CLI_IO(istream& input, ostream& output);

        string getLine() const override;
        string read() override;
        void write(const string&) const override;

        ~CLI_IO() = default;
};
#endif
