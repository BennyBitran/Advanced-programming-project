#ifndef Add
#define Add

#include "ICompress.h"
#include "IO.h"

#include <string>

class Add : public ICommand
{
    private:
    ICompress* compressor;
    IO* io;

    public:
        Add(ICompress*, IO*);
        virtual void execute() override;

        virtual ~Add() = default;
};
#endif
