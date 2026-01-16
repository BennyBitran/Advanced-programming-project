#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>

using namespace std;

int main(int argc, char *argv[])
{
    if (argc != 3)
    {
        return 1;
    }
    const char *server_ip = argv[1];
    int server_port = atoi(argv[2]);
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
    {
        // what to dooo
        return 1;
    }
    struct sockaddr_in serv_addr;
    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = inet_addr(server_ip);
    serv_addr.sin_port = htons(server_port);

    if (connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0)
    {
        close(sock);
        return 1;
    }
    // send message to server
    string message;
    while (getline(cin, message))
    {
        // protocol: send length header + \n + payload
        string header = to_string(message.length()) + "\n";
        send(sock, header.c_str(), header.length(), 0);
        send(sock, message.c_str(), message.length(), 0);
        // now receive response from server: length header first and then payload
        string len_str = "";
        char c;
        while (recv(sock, &c, 1, 0) > 0) {
            if (c == '\n')
                break;
            len_str += c;
        }

        if (len_str.empty())
            break;
        uint32_t msg_length = stoi(len_str);    //parse to int

        //now read actual data with specified length
        string data;
        data.resize(msg_length);
        size_t received = 0;
        while (received < msg_length) {
            //receive, save to buffer and update received count 
            int chunk = recv(sock, &data[received], msg_length - received, 0);
            if (chunk <= 0)
                break;
            received += chunk;
        }
        cout << data;
    }
    // send another message to continue
}
close(sock);
return 0;
}
