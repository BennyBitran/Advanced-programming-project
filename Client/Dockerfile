FROM gcc:latest

# Install Python
RUN apt-get update && apt-get install -y python3

WORKDIR /usr/client

# Copy all files from the Client directory
COPY . .

RUN g++ -o cpp_client Client.cpp

CMD ["bash"]