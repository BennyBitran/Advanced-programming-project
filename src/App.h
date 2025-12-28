#ifndef APP_H
#define APP_H

#include "ICommand.h"
#include "IO.h"
#include <map>
#include <string>
#include "Runnable.h"
#include <memory>

using namespace std;

class App : public Runnable
{
    private:
    unique_ptr<IO> io;
    map<string, unique_ptr<ICommand>>& commands;

    public:
        App(unique_ptr<IO> ioHandler, map<string, unique_ptr<ICommand>>& cmdMap);
        void run() override;

        ~App() override = default;
};
#endif