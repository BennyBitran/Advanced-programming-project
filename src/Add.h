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
    IFileSystem& fs;

    public:
        Add(const ICompress&, IFileSystem&);
        void execute(IO& io) override;

        ~Add() override = default;
};
#endif
