import sys
import socket

# Check for correct number of command-line arguments
if len(sys.argv) < 3:
    print("Usage: python pyClient.py <server_ip> <server_port>")
    sys.exit(1)

# Parse command-line arguments
server_ip = sys.argv[1]
server_port = int(sys.argv[2])

 # Create a TCP socket and connect to the server
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((server_ip, server_port))

msg = input("Message to send: ")

# Main loop to send and receive messages
while msg.lower() != "quit":
    client_socket.sendall((msg + "\n").encode())

    # Receive a line from the server
    data = b"" 
    toRead = int.from_bytes(client_socket.recv(4), byteorder='big')
    while toRead > 0:
        chunk = client_socket.recv(toRead)
        if not chunk:
            break # i dont know what to do here
        data += chunk
        toRead -= len(chunk)
   
    
    # Process and print the received line 
    line = data.decode().split("\n")[0]
    print("Server sent: " + line + "\n")

    #msg = input("Message to send: ")

client_socket.close()