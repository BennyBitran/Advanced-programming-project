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
        cerr << "Usage: " << argv[0] << " <server_ip> <server_port>" << endl;
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
        int bytes_received = recv(sock, &msg_length, sizeof(msg_length), MSG_WAITALL);
        if (bytes_received <= 0) {
            // what to do if server closed connection or error
            
        }
        uint32_t toRead = ntohl(msg_length);
        string data;
        data.resize(toRead);
        size_t received = 0;
        while (received < toRead) {
            int chunk = recv(sock, &data[received], toRead - received, 0);
            if (chunk <= 0) {
                // what to do if server closed connection or error
                
                break;
            }
            received += chunk;
        }
        if (received < toRead) {
            // incomplete message, i dont know what to do here
            break;
        }
        cout << data << endl;

        // send another message to continue
}
    close(sock);
    return 0;

    
    
   

}