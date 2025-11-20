#ifndef ADD_H
#define ADD_H
#include "ICommand.h" 
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
        void execute() override;

        ~Add() override = default;
};
#endif
