#ifndef SERVER_H
#define SERVER_H

#include <netinet/in.h>
#include <unistd.h>
#include "Executor.h"

class Server {
private:
    int port;
    int listen_sock;
    Executor& executor;  

    void bindAndListen();
    int acceptClient() const;

public:
    Server(int port, Executor& exec);
    void start();
    ~Server();
};

#endif
