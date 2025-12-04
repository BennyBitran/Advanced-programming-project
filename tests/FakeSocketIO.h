
#ifndef FAKE_SOCKET_IO_H
#define FAKE_SOCKET_IO_H

#include "../src/SocketIO.h"
#include <queue>
#include <cstring>
using namespace std;

class FakeSocketIO : public SocketIO {

public:
    queue<string> incoming
    string outgoing


    FakeSocketIO() : SocketIO(-1){}

    void pushRecv(const string& s) {
        incoming.push(s);
    }
protected:
    int recv(int, void* buf, size_t len, int) override {
        if (incoming.empty()) {
            return 0;
        }
        string chunk = incoming.front();
        incoming.pop();

        size_t n = min (len, chunk.size());
        memcpy(buf, chunk.c_str(), n);
        return (int)n;
    }

    int send(int, const void* buf, size_t len, int) override {
        outgoing.append((const char*)buf, len)
        return (int)len;
    }



}