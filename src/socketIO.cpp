#include "SocketIO.h"
#include <sys/socket.h>
#include <unistd.h>
#include <cctype>
using namespace std;

SocketIO::SocketIO(int fd) : sockfd(fd), buffer("") {}
SocketIO::~SocketIO() {}

    


string SocketIO:: read() {
// removing leading spaces before the command
   removeAllSpaces();

    while (true) {
        int len = buffer.size();
        
        for (int i = 0; i < len; i++) {
            if (isspace((unsigned char) buffer[i])) {
                string command = buffer.substr(0, i);
                buffer.erase(0, i);
                return command;
            }
        }

       if (!fillBuffer()) {
        string rest = buffer;
        buffer.clear();
        return rest;
       }

        removeAllSpaces();
   }
}


string SocketIO::getLine() const {
    removeOneSpace();

    while(true) {
        int len = buffer.size();
        for (int i = 0; i < len; i++) {
            if (buffer[i] == '\n') {
                string line = buffer.substr(0, i);
                buffer.erase(0, i + 1);

                return line;
            }
        }
        if (!fillBuffer()) {
            string rest = buffer;
            buffer.clear();
            if (!rest.empty() && rest[0] == ' '){
                rest.erase(0, 1);
            }
            return rest;
        }
    }
}


void SocketIO::write(const string& text) const {
    int totalSent = 0;
    int tosend = text.length();

    while (totalSent < tosend) {
        int sent = send(sockfd, text.c_str() + totalSent, tosend - totalSent, 0);
        if (sent <= 0) {
            return;
        }
        totalSent += sent;
    }


}












// Read more data from socket into buffer.
// Returns false if connection closed.
bool SocketIO::fillBuffer() const {
    char tmp[1024];
    int n = recv(sockfd, tmp, sizeof(tmp), 0);
    if (n <= 0) return false;
    buffer.append(tmp, n);
    return true;
}

// Remove ALL leading whitespace (for read())
void SocketIO::removeAllSpaces() const {
    while (!buffer.empty() && isspace((unsigned char)buffer[0])) {
        buffer.erase(0, 1);
    }
}

// Remove EXACTLY ONE leading space (for getLine())
void SocketIO::removeOneSpace() const {
    if (!buffer.empty() && buffer[0] == ' ') {
        buffer.erase(0, 1);
    }
}



