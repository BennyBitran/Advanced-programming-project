# Client Application
## How to Build
### Run this command inside the Client directory to build the Docker image:


docker build -t my_client_app .

## How to Run

You must pass the IP and PORT of the server as arguments.

## Option 1: Run C++ Client

# Syntax: docker run [flags] [image_name] ./cpp_client <IP> <PORT>

docker run -it --rm --network="host" my_client_app ./cpp_client 127.0.0.1 8080

## Option 2: Run Python Client

# Syntax: docker run [flags] [image_name] python3 Client.py <IP> <PORT>

docker run -it --rm --network="host" my_client_app python3 Client.py 127.0.0.1 8080

## option 3: run them locally without docker
### python:
python3 Client.py <IP> <PORT>
(when you run locally its just 127.0.0.1 8080)

### cpp:
# 1. Compile
g++ -o cpp_client Client.cpp

# 2. Run (passing IP and PORT)
./cpp_client 127.0.0.1 8080

## APP USAGE:

### to add a file:
POST [file_name] [file_content]

### to get file:
GET [file_name]

### to search file content or file name:
SEARCH [content]

### to demete a file:
DELETE [file_name]
