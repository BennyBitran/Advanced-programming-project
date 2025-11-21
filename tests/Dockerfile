FROM gcc:latest

# update and install cmake
RUN apt-get update && apt-get install -y cmake

# set up working directory
WORKDIR /usr/project

# copy source and test files
#we copy the whole context to ensure relative paths in cmake work
COPY ./src ./src
COPY ./tests ./tests

# set environment variable required by globals.cpp to avoid segfaults
ENV FILES_DIR="/usr/project/files"

# create build directory
WORKDIR /usr/project/tests/build

# configure and build the tests
RUN cmake .. && make

# run the tests
CMD ["./runTests"]