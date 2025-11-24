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
add [file name] [file content]

to get a file content:
get [file name]

to search which files contain a certain content:
search [text to serach]
# NOTE: careful to put exactly 1 space between the command and the next argument

### HOW TO BUILD AND RUN:


## to run from terminal do:
run: 

mkdir -p files

export FILES_DIR="$(pwd)/files"

mkdir build

cd build

cmake .. && make

./runProject


## to run from docker:
go too root of the project
run:  

docker build -t myproj .

docker run -it -v "$(pwd)/files:/usr/files" -e FILES_DIR=/usr/files myproj


## or just run the shell scripts provided:
chmod +x runFromDocker.sh  

./buildDockerfile  

./runProjectWithDocker.sh  

## to run tests:
cd to project root
run:

1. docker build -f tests/Dockerfile -t gtests . 

2. docker run gtests