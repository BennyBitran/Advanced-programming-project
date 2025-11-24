cmake_minimum_required(VERSION 3.10)
project(ProjectTests)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
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
  Integration_Test.cpp
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

# link gtest
target_link_libraries(runTests gtest_main)