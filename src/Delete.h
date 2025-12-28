#ifndef DELETE_H
#define DELETE_H

#include "ICommand.h"
#include "ICompress.h"
#include "IO.h"
#include "IFileSystem.h"
#include <string>

class Delete : public ICommand {
private:
    IFileSystem& fs;

public:
    Delete(IFileSystem&);
    void execute(IO& io) override;
    ~Delete() override = default;
};

#endif