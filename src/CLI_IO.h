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
        virtual std::string getLine() const override;
        virtual std::string read() override;
        virtual void write(std::string) const override;

        virtual ~CLI_IO() = default;
};
#endif
