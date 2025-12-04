#include "SocketIO.h"
#include <sys/socket.h>
#include <unistd.h>
using namespace std;

SocketIO::SocketIO(int fd) : sockfd(fd), buffer(""), line(""), parser(nullptr) {}


// this func return false if the client disconnected, o.w it fills the buffer with more data from the client, and returns true
bool SocketIO:: fillBuffer() {
    char tmp[1024];
    int n = recv(sockfd, tmp, sizeof(tmp), 0);

    if (n <= 0) {
        return false;
    }
    buffer.append(tmp, n);
    return true;
}
// this func read exactly one line from the client
std::string SocketIO::readLine() {
    while(true) {
        int pos = buffer.find('\n'); // we find where the line ends

        // if we found where the line ends, we return the whole line, and erase it from the buffer
        if(pos != string::npos) {
            string rawLine = buffer.substr (0, pos); 
            buffer.erase(0, pos + 1);
            return rawLine;
        }
        // if we didnt find the end of line, we continue to recieve data from the client. if there isnt any, we return what we have
        if(!fillBuffer()) {
            string leftOver = buffer;
            buffer.clear();
            return leftOver;
        }
    }
}
// in this func we extract the first word (command) from the client line.
string SocketIO::read() {
    string rawLine = readLine(); // wrapping in stream
    stringstream ss_in(rawLine);
    stringstream ss_out; // we need this to use cli_io constructor

    // making sure there isnt any exisiting parser
    if(parser) {
        delete parser;
        parser = nullptr;
    }

    // using existing logic in cli_io
    parser = new CLI_IO(ss_in, ss_out);

    string command = tolowerCase(parser->read());

    line = parser->getLine();

    return command;
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
            return; // maybe throw exception
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



