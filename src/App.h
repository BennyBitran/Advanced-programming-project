#ifndef APP_H
#define APP_H

#include "ICommand.h"
#include "IO.h"
#include <map>
#include <string>

class App
{
    private:
    IO* io;
    std::map<std::string, ICommand*> commands;

    public:
        App(IO*, std::map<std::string, ICommand*>);
        void run();

        ~App() = default;
};
#endif
