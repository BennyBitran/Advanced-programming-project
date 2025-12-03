#ifndef SOCKET_IO_H
#define SOCKET_IO_H

#include "IO.h"
#include <string>

using namespace std;

class SocketIO : public IO {

private:
    int sockfd;
    mutable string buffer;
    
public:
     SocketIO(int fd);
    ~SocketIO() override;

    string read() override;
    void write(const string& s) const override;
    string getLine() const override;

    private:
    bool fillBuffer() const;
    void removeAllSpaces() const;
    void removeOneSpace() const;
};

#endif
