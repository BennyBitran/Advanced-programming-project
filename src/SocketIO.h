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

    // Extracts a full line from buffer
    string readLine();

    string tolowerCase(const string& text) const;

public:
    explicit SocketIO(int fd);

    // IO interface
    string read() override;          
    string getLine() const override; 
    void write(const string&) const override;
    
    ~SocketIO() override;
};

#endif