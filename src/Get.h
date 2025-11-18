#ifndef Get
#define Get

#include "ICompress.h"
#include "IO.h"
#include "ICommand.h"

#include <string>

class Get : public ICommand
{
    private:
    ICompress* compressor;
    IO* io;
    
    public:
        Get(ICompress*, IO*);
        virtual void execute() override;

        virtual ~Get() = default;
};
#endif
