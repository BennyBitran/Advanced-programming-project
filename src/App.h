#ifndef App
#define App

#include ICommand.h
#include IO.h
#include <map>
#include <string>

class App
{
    private:
    IO io;
    std::map<std::string, ICommand> commands;

    public:
        App(IO, const std::map<std::string, ICommand>&);
        void run();

        virtual ~App() = default;
};
#endif
