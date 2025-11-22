# Advanced-programming-project
this repository will be our teams repo for the whole project

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
docker run --rm -it -v "$(pwd)/files:/usr/files" -e FILES_DIR=/usr/files myproj

## or just run the shell scripts provided:
chmod +x runFromDocker.sh
./buildDockerfile
./runProjectWithDocker.sh

## to run tests:
cd to project root
run:
1. docker build -f tests/Dockerfile -t gtests . 
2. docker run gtests