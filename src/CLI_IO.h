#ifndef CLI_IO_H
#define CLI_IO_H
#include "IO.h"

#include <string>

class CLI_IO : public IO
{
    private:
    
        std::string line;

    public:
        CLI_IO();
        std::string getLine() const override;
        std::string read() override;
        void write(const std::string&) const override;

        ~CLI_IO() = default;
};
#endif
