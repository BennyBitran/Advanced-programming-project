# Advanced-programming-project
this repository will be our teams repo for the whole project

to run from terminal do:
run: pwd when in files folder (where you want to save the files)
copy the output 
run: export MY_FILES=absolute path to files folder (the one you copied)
cd to build folder
run: cmake .. && make
./runProject

to run from docker:
go too root of the project
run: 
docker build -t myproj .
docker run --rm -it -v "$(pwd)/files:/usr/files" -e FILES_DIR=/usr/files myproj