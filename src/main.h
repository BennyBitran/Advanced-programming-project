#ifndef main
#define main

#include ICommand.h
#include App.h
#include <map>
#include <string>

class main
{
    private:
    
    std::map<std::string, ICommand> createCommandsMap();

    public:
        main();

        virtual ~main() = default;
};
#endif
