#ifndef ICOMMAND_H
#define ICOMMAND_H
#include "IO.h"
#include <string>

class ICommand
{
    public:

    virtual void execute(IO& io) = 0;
    virtual ~ICommand() = default;
};
#endif
