#ifndef SEARCH_H
#define SEARCH_H

#include "ICompress.h"
#include "IO.h"
#include "ICommand.h"
#include "IFileSystem.h"
#include <string>

class Search : public ICommand
{
    private:
    const ICompress& compressor;
    IO& io;
    IFileSystem& fs;
    
    public:
        Search(const ICompress&, IO&, IFileSystem&);
        virtual void execute() override;

        virtual ~Search() = default;
};
#endif
