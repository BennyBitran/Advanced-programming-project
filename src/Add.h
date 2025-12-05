#ifndef ADD_H
#define ADD_H
#include "ICommand.h" 
#include "ICompress.h"
#include "IO.h"
#include "IFileSystem.h"

#include <string>

class Add : public ICommand
{
    private:
    const ICompress& compressor;
    IO& io;
    IFileSystem& fs;

    public:
        Add(const ICompress&, IO&, IFileSystem&);
        void execute() override;

        ~Add() override = default;
};
#endif
