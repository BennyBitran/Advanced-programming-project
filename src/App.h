#ifndef APP_H
#define APP_H

#include "ICommand.h"
#include "IO.h"
#include <map>
#include <string>

using namespace std;

class App
{
    private:
    IO& io;
    map<string, ICommand*>& commands;

    public:
        App(IO&, map<string, ICommand*>&);
        void run();

        ~App() = default;
};
#endif
