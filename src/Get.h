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
    IFileSystem& fs;
    
    public:
        Get(const ICompress&, IFileSystem&);
        virtual void execute(IO& io) override;

        virtual ~Get() = default;
};
#endif
