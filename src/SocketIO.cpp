#include "SocketIO.h"
#include <sys/socket.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <iostream>
#include <stdexcept>

using namespace std;

SocketIO::SocketIO(int fd) : sockfd(fd), buffer(""), line("") {}

string SocketIO::readLine() {
    bool received = false;
    char tmp[1024];
    while (true) {
        // check if we already have a full line in the buffer
        int pos = buffer.find('\n');
        // extract and return the line
        if (pos != string::npos) {
            string rawLine = buffer.substr(0, pos);
            buffer.erase(0, pos + 1);
            return rawLine;
        }
        // keep receiving data from socket until \n
        int n = recv(sockfd, tmp, sizeof(tmp), 0);

        // error while receiving
        if (n < 0) {
            throw runtime_error("Failed to receive data from client");
        }

        // could be either end of data or connection closed (client disconnected)
        if (n == 0) {
            // if we never received any data, connection is closed
            if (!received) {
                throw runtime_error("Connection closed by client");
            }
            string leftOver = buffer;
            buffer.clear();
            return leftOver;
        }
        // flag data received at least once
        received = true;
        buffer.append(tmp, n);  //add received data to buffer
    }
}

// extract first word (command) from the client line and save the rest for getLine
string SocketIO::read() {
    string rawLine;
    try {
        rawLine = readLine(); // read a full line from socket
    }
    catch (...) {
        throw;  // rethrow any exceptions
    }

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

void SocketIO::sendData(string content) {
    // Always force the protocol structure
    this->write("200 Ok\n\n" + content);
}

// send over bytes and check if we sucssesfully sent everything
void SocketIO::write(const string& text) const {
    int total = 0;
    int tot_to_send = text.length();
    //change to little endian and send length of the package first
    uint32_t len = htonl(tot_to_send);
    if (send(sockfd, &len, 4, 0) <= 0) {
        throw runtime_error("Failed to send data length to client");
    }
    //while we havent sent everything yet, keep sending
    while(total < tot_to_send) {
        int sent = send(sockfd, text.c_str() + total, tot_to_send - total, 0); 
        //if we sent 0 bytes, that means the connection is closed
        if(sent == 0) {
            return;
        }
        if (sent < 0) {
            throw runtime_error("Failed to send data to client");
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