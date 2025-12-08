#include "App.h"
#include "ICommand.h"
#include "IO.h"
using namespace std;

App::App(unique_ptr<IO> ioHandler,
         map<string, unique_ptr<ICommand>> cmdMap)
    : io(move(ioHandler)), commands(move(cmdMap)) {}

void App::run()
{
    //loop forever because the program never stops
    while (true)
    {   
        //read next from IO (app doesnt need to know from where)
        string cmd = io->read();
        //check if command exists in the map
        if(commands.count(cmd)) {
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
        else if (cmd.empty()) {
            //client disconnected, just end the app
            break;
        }
        else {
            //invalid command, just continue
            io->write("400 Bad Request");
        }
        continue;
    }
}