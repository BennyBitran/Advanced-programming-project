#ifndef SERVER_H
#define SERVER_H

#include <thread>
#include <vector>

class Server {
private:
    int port;
    int listen_sock;

    void bindAndListen();
    int acceptClient() const;

public:
    explicit Server(int port);
    void start();

    ~Server();
};

#endif