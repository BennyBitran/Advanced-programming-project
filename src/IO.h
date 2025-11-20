#ifndef IO_H
#define IO_H

#include <string>

class IO
{
    public:

        virtual std::string getLine() = 0;
        virtual std::string read() = 0;
        virtual void write(const std::string&) const = 0;

        virtual ~IO() = default;
};
#endif
