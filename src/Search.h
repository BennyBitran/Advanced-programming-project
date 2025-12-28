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
    IFileSystem& fs;
    
    public:
        Search(const ICompress&, IFileSystem&);
        virtual void execute(IO& io) override;

        virtual ~Search() = default;
};
#endif
