#ifndef SERVER_H
#define SERVER_H

#include <netinet/in.h>
#include <unistd.h>
#include "Executor.h"
#include "ICompress.h"
#include "IFileSystem.h"
#include "ICommand.h"
#include "App.h"

class Server {
private:
    int port;
    int listen_sock;
    Executor& executor;  
    const ICompress& compressor;
    const IFileSystem& fs;

    void bindAndListen();
    int acceptClient() const;
    unique_ptr<Runnable> AppFactory(int client_fd);

public:
    Server(int port, Executor& exec);
    void start();
    ~Server();
};

#endif
