#ifndef IO
#define IO

#include <string>

class IO
{
    public:

        virtual std::string getLine() = 0;
        virtual std::string read() = 0;
        virtual void write(std::string&) const = 0;

        virtual ~IO() = default;
};
#endif
