#ifndef APP_H
#define APP_H

#include "ICommand.h"
#include "IO.h"
#include <map>
#include <string>
#include "Runnable.h"

using namespace std;

class App : public Runnable
{
    private:
    IO& io;
    map<string, ICommand*>& commands;

    public:
        App(IO&, map<string, ICommand*>&);
        void run() const override;

        ~App() override = default;
};
#endif
