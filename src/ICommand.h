#ifndef ICOMMAND_H
#define ICOMMAND_H

#include <string>

class ICommand
{
    public:

    virtual void execute() = 0;
    virtual ~ICommand() = default;
};
#endif
