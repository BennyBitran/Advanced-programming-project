# Advanced-programming-project
this repository is our project and its main objective is to start the implementation of our home made "Drive" system.
this app (for now) implements the ability to add files, get their content and search content in all files.
the app compresses the data into files and saves them in a folder passed by an environment vriable (that needs to be exported into FILES_DIR)

## Part 2 changes
Fortunately, we put a lot of effort and thought on building the structure of part 1 such that it will be closed for changes and open for extensions. thanks to that, the following did not force us to change our code:
1. the fact that commands names changed
2. the fact that new commands were added
3. the fact that we moved from cli to socket
however, we are only humans after all, so we didnt think of everything. we had to implement a new level, the IfileSystem interface, which allowed us to handle mutex in this part more cleanly. in addition, we had to change a bit in order to handle the commands outputs more correctly.
overall, we believe our implemntation was rather fine SOLID wise, and we certainley learned some valuable lessons


## Requirements:
Docker
To build and run locally: CMake + GCC


## Environement Variable: 
FILES_DIR=... (export this variable in the wanted directory when run locally)


## APP USAGE:

### to add a file:
POST [file_name] [file_content]

### to get file:
GET [file_name]

### to search file content or file name:
SEARCH [content]

### to demete a file:
DELETE [file_name]


### NOTE: careful to put exactly 1 space between the command and the next argument


#  Build and Run

### Client side:
to run the clients you must ensure server is running on the ip and port you pass in the command line arguments. if you run server locally just do ip = 127.0.0.1 port = 8080

### for client only side run instructions - go to ./client/README.md

### Option 1: Docker Compose (Recommended)

This is the easiest way to run the project.

**1. Run the Server**
Starts the server on `127.0.0.1:8080`.

```bash
docker-compose up --build server
```

**2. Run the Clients**
You can run the Python or C++ client in a separate terminal.

```bash
# Run Python Client
docker-compose run --rm client_py

# Run C++ Client
docker-compose run --rm client_cpp
```

**3. Run Integration Tests**
Builds and runs the Google Test suite against the containerized server.
this command will also run the client in the background. so no need to run the server before this.

```bash
docker-compose up --build tests
```

**4. Stop Everything**

```bash
docker-compose down
```

-----

### Option 2: Run Locally

If you prefer to run locally

**1. Run the Server**

```bash
mkdir -p files build
export FILES_DIR="$(pwd)/files"
cd build
cmake .. && make
./runProject 8080 5
```
(or choose your prefered port and number of working threads)


**2. Run the Tests**

```bash
export FILES_DIR="$(pwd)/files" 
cd tests
mkdir -p build && cd build
cmake .. && make
./runTests
```

## authors:
Gilad Tenenbaum

Ilya Vladimirskiy

Benny Bitran



![alt text](<imagesProof/more multi.png>)
![alt text](<imagesProof/multi client proof.png>)
