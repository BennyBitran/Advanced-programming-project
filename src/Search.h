#ifndef SEARCH_H
#define SEARCH_H

#include "ICompress.h"
#include "IO.h"
#include "ICommand.h"

#include <string>

class Search : public ICommand
{
    private:
    const ICompress& compressor;
    IO& io;
    
    public:
        Search(const ICompress&, IO&);
        virtual void execute() override;

        virtual ~Search() = default;
};
#endif
