#ifndef Get_H
#define Get_H

#include "ICompress.h"
#include "IO.h"
#include "ICommand.h"

#include <string>

class Get : public ICommand
{
    private:
    const ICompress& compressor;
    IO& io;
    
    public:
        Get(const ICompress&, IO&);
        virtual void execute() override;

        virtual ~Get() = default;
};
#endif
