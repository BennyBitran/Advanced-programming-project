#include "App.h"
#include "ICommand.h"
#include "IO.h"
#include <stdexcept>

using namespace std;

App::App(unique_ptr<IO> ioHandler,
         map<string, unique_ptr<ICommand>>& cmdMap)
    : io(move(ioHandler)), commands(cmdMap) {}

void App::run()
{
    //loop forever because the program never stops
    while (true)
    {   
        string cmd;
        try {
            //read next from IO (app doesnt need to know from where)
            cmd = io->read();
        } 
        catch(...) {
            break; //exit the loop on connection closed or any error when reading
        }
        
        //check if command exists in the map
        if(commands.count(cmd)) {
            try
            {
                //execute the command found in the map
                commands[cmd]->execute(*io);
            }
            //if command not found, or anything goes wrong - just continue
            catch(...) {
                continue;
            }
        }
        else {
            io->write("400 Bad Request");
            continue;
        }
        continue;
    }
}