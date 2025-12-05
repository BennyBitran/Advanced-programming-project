cmake_minimum_required(VERSION 3.10)
project(AdvancedProject)

set(CMAKE_CXX_STANDARD 17)

#note - uncomment the files below as you create them
add_executable(runProject    src/main.cpp   src/Add.cpp    src/Add.h    src/Get.cpp    src/Get.h       src/IO.h    
    src/CLI_IO.cpp    src/CLI_IO.h    src/App.cpp    src/App.h 
    src/ICommand.h    src/ICompress.h    src/RLE.cpp    src/RLE.h
    src/Search.cpp    src/Search.h  src/IO.h    src/Globals.h   src/Globals.cpp     
    src/IFileSystem.h  src/FileManager.cpp  src/FileManager.h)