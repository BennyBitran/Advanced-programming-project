import sys
import socket

# Check for correct number of command-line arguments
if len(sys.argv) < 3:
    sys.exit(1)

# Parse command-line arguments
server_ip = sys.argv[1]
server_port = int(sys.argv[2])

 # Create a TCP socket and connect to the server
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client_socket.connect((server_ip, server_port))

msg = input()

# Main loop to send and receive messages
while msg.lower() != "quit":
    # Protocol (Length + \n + Payload)
    payload = msg.encode()
    header = f"{len(payload)}\n".encode()
    client_socket.sendall(header + payload)

    # read header
    header_data = b""
    while True:
        char = client_socket.recv(1)
        if not char or char == b'\n':
            break
        header_data += char
    
    if not header_data: break
    toRead = int(header_data.decode())  #parse length to int

    # receive Payload
    data = b"" 
    while toRead > 0:
        chunk = client_socket.recv(min(toRead, 4096))
        if not chunk: break
        data += chunk
        toRead -= len(chunk)
   
    print(data.decode())
    msg = input()

client_socket.close()