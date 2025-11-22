#!/bin/bash
#exit on errors
set -e
#run the container with env var 
docker run --rm -it -v "$(pwd)/files:/usr/files" -e FILES_DIR=/usr/files myproj