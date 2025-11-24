cmake_minimum_required(VERSION 3.10)
project(ProjectTests)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)

# fetch googletest from github
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
  #prevent warning
  DOWNLOAD_EXTRACT_TIMESTAMP TRUE
)
# prevent overriding parent compiler settings for windows
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# include the source directory to find headers
include_directories(../src)

# define the test executable
add_executable(
  runTests 
  RLETest.cpp
  AddTest.cpp
  GetTest.cpp
  SearchTest.cpp
  FakeCompress.h
  FakeIO.h
  helpers.h
  helpers.cpp

  ../src/RLE.cpp 
  ../src/Globals.cpp
  ../src/Add.cpp
  ../src/Get.cpp
  ../src/Search.cpp
  ../src/CLI_IO.cpp
  
)

# link gtest and gmock
target_link_libraries(runTests gtest_main gmock_main)