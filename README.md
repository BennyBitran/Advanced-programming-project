# Advanced-programming-project
this repository is our project and its main objective is to start the implementation of our home made "Drive" system.
this app (for now) implements the ability to add files, get their content and search content in all files.
the app compresses the data into files and saves them in a folder passed by an environment vriable (that needs to be exported into FILES_DIR)


## Requirements:
Docker
To build and run locally: CMake + GCC


## Environement Variable: 
FILES_DIR=... (export this variable in the wanted directory when run locally)


## Usage:
after build and run simply use these commands format:
to add a file just write:
post [file name] [file content]

to get a file content:
get [file name]

to search which files contain a certain content:
search [text to serach]

to delete a file:
delete [file name]

# NOTE: careful to put exactly 1 space between the command and the next argument


##  Build and Run

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
./runProject
```

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

Ilya vladimirskiy

Benny Bitran



![alt text](<imagesProof/more multi.png>)
![alt text](<imagesProof/multi client proof.png>)