#ifndef Get_H
#define Get_H

#include "ICompress.h"
#include "IO.h"
#include "ICommand.h"
#include "IFileSystem.h"
#include <string>

class Get : public ICommand
{
    private:
    const ICompress& compressor;
    IO& io;
    IFileSystem& fs;
    
    public:
        Get(const ICompress&, IO&, IFileSystem&);
        virtual void execute() override;

        virtual ~Get() = default;
};
#endif
