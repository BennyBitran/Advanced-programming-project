#include "Server.h"  
#include <sys/socket.h>
#include <arpa/inet.h>
#include "App.h"
#include "SocketIO.h"
#include "Add.h"
#include "Get.h"
#include "Search.h"
#include <map>
#include <string>
//include "runnable"

using namespace std;

Server::Server(int port, Executor& exec, Icompress& comp, IFileSystem& filesystem)
    : port(port), listen_sock(-1), executor(exec), compressor(comp), fs(filesystem) {}

// Setup server socket
void Server::bindAndListen() {
    listen_sock = socket(AF_INET, SOCK_STREAM, 0);
    if (listen_sock < 0) return;

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(port);

    if (bind(listen_sock, (sockaddr*)&addr, sizeof(addr)) < 0) {
        close(listen_sock);
        listen_sock = -1;
        return;
    }

    if (listen(listen_sock, SOMAXCONN) < 0) {
        close(listen_sock);
        listen_sock = -1;
        return;
    }
}


void Server::start() {
    bindAndListen();
    if (listen_sock < 0) return;

    while (true) {
        int client_fd = accept(listen_sock, nullptr, nullptr);
        if (client_fd < 0) continue;

        // Delegate to executor (Executor will start the thread)
        executor.execute(AppFactory(client_fd));
    }
}
// Create App instance for each client
//CHANGE TO RETURN A RUNNABLE POINTER
App Server::AppFactory(int client_fd) {
    // Create SocketIO for client
    SocketIO io(client_fd);
    //define commands map 
    Add add(compressor, io, fs);
    Get get(compressor, io, fs);
    Search search(compressor, io, fs);

    map<string, ICommand*> commands;

    commands["post"] = &add;
    commands["get"] = &get;
    commands["search"] = &search;

    App app(io, commands);
    return &app;
}

Server::~Server() {
    if (listen_sock >= 0) {
        close(listen_sock);
    }
}