#ifndef SERVER_H
#define SERVER_H

#include <netinet/in.h>
#include <unistd.h>
#include "Executor.h"
#include "ICompress.h"
#include "IFileSystem.h"
#include "ICommand.h"
#include "App.h"

using namespace std;

class Server {
private:
    int port;
    int listen_sock;
    Executor& executor;  
    map<string, unique_ptr<ICommand>>& commands;

    void bindAndListen();
    int acceptClient() const;
    unique_ptr<Runnable> AppFactory(int client_fd);

public:
    Server(int port, Executor& exec, map<string, unique_ptr<ICommand>>& cmdMap);
    void start();
    ~Server();
};

#endif
