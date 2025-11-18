FROM gcc:latest
#update and install latest cmake
RUN apt-get update && apt-get install -y cmake
#create a directory in the container to hold the project files
COPY . /usr
#move into that directory
WORKDIR /usr
#set an environment variable for the files directory
ENV FILES_DIR=/usr/MyFiles
#create a build directory inside the project directory
RUN mkdir build
#move into the build directory
WORKDIR /usr/build
#run cmake to configure the project and generate the makefiles, then build the project
RUN cmake .. && make
#set the default command to run the tests executable
CMD [ "./runProject" ]