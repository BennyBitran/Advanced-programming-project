#include "Server.h"
#include "ClientHandler.h"     // must inherit Runnable
#include <sys/socket.h>
#include <arpa/inet.h>

Server::Server(int port, Executor& exec)
    : port(port), listen_sock(-1), executor(exec) {}

void Server::bindAndListen() {
    listen_sock = socket(AF_INET, SOCK_STREAM, 0);
    if (listen_sock < 0) return;

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(port);

    if (bind(listen_sock, (sockaddr*)&addr, sizeof(addr)) < 0) return;
    if (listen(listen_sock, SOMAXCONN) < 0) return;
}

int Server::acceptClient() const {
    return accept(listen_sock, nullptr, nullptr);
}

void Server::start() {
    bindAndListen();
    if (listen_sock < 0) return;

    while (true) {
        int client_fd = acceptClient();
        if (client_fd < 0) continue;

        // Must allocate on heap because thread will outlive this function scope
        clientHandler* handler = new ClientHandler(client_fd);

        // Delegate to executor (Executor will start the thread)
        executor.execute(*handler);
    }
}

Server::~Server() {
    if (listen_sock >= 0) {
        close(listen_sock);
    }
}
