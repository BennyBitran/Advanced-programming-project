#ifndef DELETE_H
#define DELETE_H

#include "ICommand.h"
#include "ICompress.h"
#include "IO.h"
#include "IFileSystem.h"
#include <string>

class Delete : public ICommand {
private:
    const ICompress& compressor; // i added for symmetry with other commands but not sure
    IFileSystem& fs;

public:
    Delete(const ICompress&, IFileSystem&);
    void execute(IO& io) override;
    ~Delete() override = default;
};

#endif