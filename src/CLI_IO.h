#ifndef CLI_IO_H
#define CLI_IO_H
#include "IO.h"

#include <iostream>
#include <string>

class CLI_IO : public IO
{
    private:
    
        std::string line;
        std::istream& input;
        std::ostream& output;

    public:
        //default constructor (input from cin and output to cout)
        CLI_IO();

        CLI_IO(std::istream& input, std::ostream& output);

        std::string getLine() const override;
        std::string read() override;
        void write(const std::string&) const override;

        ~CLI_IO() = default;
};
#endif
