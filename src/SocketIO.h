#ifndef SOCKET_IO_H
#define SOCKET_IO_H

#include "IO.h"
#include <string>
#include <sstream>

using namespace std;

class SocketIO : public IO {

private:
    int sockfd;
    // Buffer used when reading from socket
    string buffer;

    // whats left after the command
    string line;

    string tolowerCase(const string& text) const;

public:
    explicit SocketIO(int fd);

    // IO interface
    string read() override;          
    string getLine() const override; 
    void write(const string&) const override;
    void sendData(string content) override;
    ~SocketIO() override;
};

#endif