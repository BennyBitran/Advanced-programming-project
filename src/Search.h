#ifndef SEARCH_H
#define SEARCH_H

#include "ICompress.h"
#include "IO.h"
#include "ICommand.h"

#include <string>

class Search : public ICommand
{
    private:
    ICompress* compressor;
    IO* io;
    
    public:
        Search(ICompress*, IO*);
        virtual void execute() override;

        virtual ~Search() = default;
};
#endif
//class and macros need to have dif names.