#ifndef SOCKET_IO_H
#define SOCKET_IO_H

#include "IO.h"
#include "CLI_IO.h"
#include <string>
#include <sstream>

class SocketIO : public IO {

private:
    int sockfd;

    // Buffer used when reading from socket
    std::string buffer;
   
    // whats left after the command
    std::string line;

    // CLI_IO used for parsing commands from a stringstream
      CLI_IO* parser = nullptr;

    // Reads raw bytes from socket into buffer
    bool fillBuffer();

    // Extracts a full line from buffer
    std::string readLine();

    // apparently there is no string.toLowerCase in cpp
    std::string tolowerCase(const std::string& text) const;
public:
    explicit SocketIO(int fd);
    ~SocketIO() override;

    // IO interface
    std::string read() override;          
    std::string getLine() const override; 
    void write(const std::string&) const override;
};

#endif
