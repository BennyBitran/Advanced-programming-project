#ifndef IO_H
#define IO_H

#include <string>
using namespace std;

class IO
{
    public:

        virtual string getLine() const = 0;
        virtual string read() = 0;
        virtual void write(const string&) const = 0;

        virtual ~IO() = default;
};
#endif
