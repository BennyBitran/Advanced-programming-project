#ifndef ADD_H
#define ADD_H

#include "ICompress.h"
#include "IO.h"
#include "ICommand.h"

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
//class and macros need to have dif names.