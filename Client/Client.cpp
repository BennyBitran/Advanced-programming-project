#include <iostream> 
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc != 3) {
        return 1;
    }
    const char* server_ip = argv[1];
    int server_port = atoi(argv[2]);
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        //what to dooo
        return 1;
    }
    struct sockaddr_in serv_addr;
    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = inet_addr(server_ip);
    serv_addr.sin_port = htons(server_port);

    if (connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) < 0) {
        close(sock);
        return 1;
    }
    // send message to server
    string message;
    while (getline(cin, message)) {
        string toSend = message + "\n";

        send(sock, toSend.c_str(), toSend.size(), 0);

        // receive response length from server
        uint32_t msg_length = 0;
        if (recv(sock, &msg_length, sizeof(msg_length), MSG_WAITALL) <= 0) {
            return 1;
        }
        //convert into correct indian to save a number
        msg_length = ntohl(msg_length);

        string data;
        data.resize(msg_length);
        size_t received = 0;
        while (received < msg_length) {
            int chunk = recv(sock, &data[received], msg_length - received, 0);
            if (chunk <= 0) {
                // what to do if server closed connection or error
                break;
            }
            received += chunk;
        }
        if (received < msg_length) {
            // incomplete message, i dont know what to do here
            break;
        }
        cout << data;
        // send another message to continue
    }
    close(sock);
    return 0;

}
