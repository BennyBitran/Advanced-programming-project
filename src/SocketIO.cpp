#include "SocketIO.h"
#include <sys/socket.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <iostream>
#include <stdexcept>
#include <string>

using namespace std;

SocketIO::SocketIO(int fd) : sockfd(fd), buffer(""), line("") {}

string SocketIO::read()
{
    string header = "";
    char c;

    // READ HEADER: read one byte at a time until we hit \n
    while (true)
    {
        int n = recv(sockfd, &c, 1, 0);
        if (n <= 0)
            throw runtime_error("Connection closed while reading header");
        if (c == '\n')
            break; // end of header (length)
        header += c;
    }
    // parse to int
    int expectedLength = stoi(header);
    // read the payload based on expected length
    string payload = "";
    char buffer[1024];
    int totalReceived = 0; // counter for received bytes

    // READ PAYLOAD
    while (totalReceived < expectedLength)
    {
        // read either 1024 bytes or whatever is left to reach expectedLength
        int toRead = min(1024, expectedLength - totalReceived);
        int n = recv(sockfd, buffer, toRead, 0);

        if (n <= 0)
            throw runtime_error("Connection closed while reading payload");

        payload.append(buffer, n);
        totalReceived += n;
    }
    // extract command and payload
    this->line.clear();
    stringstream ss(payload);
    string command;

    // Extract the first word (the command)
    if (!(ss >> command))
        return "";
    //dump content into line (the rest of the payload)
    streampos pos = ss.tellg();
    if (pos != static_cast<streampos>(-1))
    {
        // Get everything from that position to the end
        this->line = payload.substr(pos);

        // Trim exactly one leading space (the one after the command)
        if (!this->line.empty() && this->line[0] == ' ')
        {
            this->line.erase(0, 1);
        }
    }

    return tolowerCase(command);
}

string SocketIO::getLine() const
{
    return line;
}

void SocketIO::sendData(string content)
{
    // Always force the protocol structure
    this->write("200 Ok\n\n" + content);
}

// send over bytes and check if we sucssesfully sent everything
void SocketIO::write(const string &text) const
{
    string msg = text;

    int tot_to_send = msg.length();

    // send the length as a string header + \n
    string header = to_string(tot_to_send) + "\n";
    if (send(sockfd, header.c_str(), header.length(), 0) <= 0)
    {
        throw runtime_error("Failed to send data length header to client");
    }

    int total = 0;
    while (total < tot_to_send)
    {
        int sent = send(sockfd, msg.c_str() + total, tot_to_send - total, 0);
        if (sent <= 0)
            throw runtime_error("Failed to send payload");
        total += sent;
    }
}

string SocketIO::tolowerCase(const string &text) const
{
    string result = text;
    for (char &c : result)
    {
        c = tolower(c);
    }
    return result;
}

SocketIO::~SocketIO()
{
    close(sockfd);
}