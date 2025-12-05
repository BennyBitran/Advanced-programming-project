#include "SocketIO.h"
#include <sys/socket.h>
#include <unistd.h>
using namespace std;

SocketIO::SocketIO(int fd) : sockfd(fd), buffer(""), line("") {}

string SocketIO::readLine() {
    char tmp[1024];
    while (true) {
        // check if we already have a full line in the buffer
        int pos = buffer.find('\n');
        //if yes, extract and return the line
        if (pos != std::string::npos) {
            string rawLine = buffer.substr(0, pos);
            buffer.erase(0, pos + 1);
            return rawLine;
        }
        // try to receive more data
        int n = recv(sockfd, tmp, sizeof(tmp), 0);
        // no more data - return what's left
        if (n <= 0) {
            string leftOver = buffer;
            buffer.clear();
            return leftOver;
        }
        buffer.append(tmp, n);  //add received data to buffer
    }
}

// in this func we extract the first word (command) from the client line and save the rest for getLine
string SocketIO::read() {
    string rawLine = readLine(); // read a full line from socket
    stringstream ss(rawLine);   // use stringstream to parse the line
    string command; 
    ss >> command; // Extract the first word as command
    ss.ignore(1) ; // Ignore the space after the command (must be space since we used >>)
    getline(ss, this->line); // Store the rest of the line for getLine()
    return tolowerCase(command);    // return the command in lowercase
}

string SocketIO:: getLine() const {
    return line;
}

// we send over bytes and check if we sucssesfully sent everything
void SocketIO::write(const string& text) const {
    int total = 0;
    int remaining = text.length();

    while(total < remaining) {
        // third argument = number of bytes left to send
        // text.c_str() = pointer to the string we need to send
        int sent = send(sockfd, text.c_str() + total, remaining - total, 0); 

        if(sent <= 0) {
            return;
        }
        total += sent;
    }
}

string SocketIO:: tolowerCase(const string& text) const {
    string result = text;
    for(char& c : result) {
        c = tolower(c);
    }
    return result;
}

SocketIO:: ~SocketIO(){
    close(sockfd);
}