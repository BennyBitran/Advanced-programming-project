#ifndef Get
#define Get

#include ICompress.h
#include IO.h

#include <string>

class Get : public ICommand
{
    private:
    ICompress compressor;
    IO io;
    
    public:
        Get();
        virtual void execute() override;

        virtual ~Get() = default;
};
#endif
