#ifndef Search
#define Search

#include ICompress.h
#include IO.h

#include <string>

class Search : public ICommand
{
    private:
    ICompress compressor;
    IO io;
    
    public:
        Search();
        virtual void execute() override;

        virtual ~Search() = default;
};
#endif
