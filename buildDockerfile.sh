#!/bin/bash
#exit on errors
set -e

#build the docker image
docker build -t myproj .

#create files folder if missing
mkdir -p files

