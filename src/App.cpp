#include "App.h"
#include "ICommand.h"
#include "IO.h"
using namespace std;

App::App(IO* ioHandler, map<string, ICommand*> cmd) : io(ioHandler) commands(cmd) {}

void App::run()
{
    //loop forever because the program never stops
    while (true)
    {   
        //read next from IO (app doesnt need to know from where)
        string cmd = io->read();
        try
        {
            //execute the command found in the map
            commands[cmd]->execute();
        }
        //if command not found, or anything goes wrong - just continue
        catch(...) {
            continue;
        }
    }
}
