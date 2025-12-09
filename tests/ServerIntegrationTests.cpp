#include <gtest/gtest.h>
#include <thread>
#include <chrono>
#include <string>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>

using namespace std;
//---------------------------------IMPORTANT NOTE-----------------------------//
//-------------RUN SERVER ON A DIFFERENT TERMINAL IF RUN LOCALLY--------------//
//-------------NO NEED IF YOU USE DOCKER - COMPOSE ---------------------------//
// Helper function to connect to server
int connectToServer() {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in serv_addr;
    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1");
    serv_addr.sin_port = htons(8080);
    
    if (connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) < 0) {
        return -1;
    }
    return sock;
}

// helper function to send a request and receive response
// This handles the protocol (Send String, Recv Length, Recv Data)
string sendRequest(int sock, string message) {
    // Send the command
    send(sock, message.c_str(), message.size(), 0);

    // Receive Length
    uint32_t msg_length = 0;
    int n = recv(sock, &msg_length, sizeof(msg_length), MSG_WAITALL);
    if (n <= 0) return ""; 
    
    msg_length = ntohl(msg_length);

    // Receive message
    string data;
    data.resize(msg_length);
    recv(sock, &data[0], msg_length, 0);
    
    return data;
}

TEST(serverIntegrationTests, SingleClientFullFlow) {
    int sock = connectToServer();

    string response;

    response = sendRequest(sock, "post my_notes secret_data\n");
    ASSERT_EQ(response, "201 Created");

    response = sendRequest(sock, "get my_notes\n");
    ASSERT_EQ(response, "200 Ok\n\nsecret_data");

    response = sendRequest(sock, "search my_n\n");
    ASSERT_EQ(response, "200 Ok\n\nmy_notes");

    response = sendRequest(sock, "delete my_notes\n");
    ASSERT_EQ(response, "204 No Content");


    response = sendRequest(sock, "get my_notes\n");
    ASSERT_EQ(response, "404 Not Found");

    close(sock);
}


//test two clients interleaved operations and assert server handles correctly
TEST(serverIntegrationTests, TwoClientsInterleavedManual) {
    //connect two clients to server
    int client1 = connectToServer();
    int client2 = connectToServer();

    string response;
    response = sendRequest(client1, "post shared_doc shared_data\n");
    ASSERT_EQ(response, "201 Created");

    response = sendRequest(client2, "get shared_doc\n");
    ASSERT_EQ(response, "200 Ok\n\nshared_data");

    response = sendRequest(client2, "delete shared_doc\n");
    ASSERT_EQ(response, "204 No Content");

    response = sendRequest(client1, "get shared_doc\n");
    ASSERT_EQ(response, "404 Not Found");

    sendRequest(client1, "post c1_only my_data\n");
    
    response = sendRequest(client2, "delete random_file\n");
    ASSERT_EQ(response, "404 Not Found");

    close(client1);
    close(client2);
}
