# Advanced-programming-project
this repository is our project and its main objective is to start the implementation of our home made "Drive" system.
this app (for now) implements the ability to add files, get their content and search content in all files.
the app compresses the data into files and saves them in a folder passed by an environment vriable (that needs to be exported into FILES_DIR)


## PART 2
our previous code was NOT "closed to changes - open to extension" enough since we (with the stubbornness of Benny) didn't implement an interface for a File System that will handle the app's file management.
this change is important for a few reasons:
first and foremost, if in the future we don't want a folder file system but anything else, let's say a database, we would have to change ALL our current implementations, forcing changes into our current code.
and second, more relevant to this specific part of the project - locking each part of the code that accesses the files is just ugly and unreliable since we would need a global mutex lock, instead of simply having a file system that makes sure the access to the files happens exclusively for each thread.


## Requirements:
Docker
To build and run locally: CMake + GCC


## Environement Variable: 
FILES_DIR=... (export this variable in the wanted directory when run locally)


## Usage:
after build and run simply use these commands format:
to add a file just write:
add [file name] [file content]

to get a file content:
get [file name]

to search which files contain a certain content:
search [text to serach]
# NOTE: careful to put exactly 1 space between the command and the next argument

### HOW TO BUILD AND RUN:


## to run locally do:
run: 

1. mkdir -p files

2. export FILES_DIR="$(pwd)/files"

3. mkdir build

4. cd build

5. cmake .. && make

6. ./runProject


## to run from docker:
go to root of the project

run:  

1. mkdir -p files

2. docker build -t myproj .

3. docker run -it -v "$(pwd)/files:/usr/files" -e FILES_DIR=/usr/files myproj


## to run tests from Docker:
cd to project root

run:

1. docker build -f tests/Dockerfile -t gtests . 

2. docker run gtests

## to run tests locally:
run:

1. export FILES_DIR="$(pwd)/files" 

2. cd tests

3. mkdir build

4. cmake .. && make

5. ./runTests


## authors:
Gilad Tenenbaum

Ilya vladimirskiy

Benny Bitran


![alt text](image.png)