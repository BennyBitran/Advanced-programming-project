#ifndef ADD_H
#define ADD_H
#include "ICommand.h" 
#include "ICompress.h"
#include "IO.h"

#include <string>

class Add : public ICommand
{
    private:
    const ICompress& compressor;
    IO& io;

    public:
        Add(const ICompress&, IO&);
        void execute() override;

        ~Add() override = default;
};
#endif
