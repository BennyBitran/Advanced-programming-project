#ifndef CLI_IO
#define CLI_IO
#include "IO.h"

#include <string>

class CLI_IO : public IO
{
    private:
    
        std::string line;

    public:
        CLI_IO();
         std::string getLine() override;
         std::string read() override;
         void write(std::string&) const override;

        virtual ~CLI_IO() = default;
};
#endif
