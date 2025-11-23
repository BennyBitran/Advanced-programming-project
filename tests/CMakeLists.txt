cmake_minimum_required(VERSION 3.10)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)

# -----------------------------
# Fetch GoogleTest
# -----------------------------
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
  DOWNLOAD_EXTRACT_TIMESTAMP TRUE
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# -----------------------------
# Build test executable
# -----------------------------
add_executable(runTests
    RLETest.cpp
    AddTest.cpp
    GetTest.cpp
    SearchTest.cpp
    CLI_IO_Test.cpp
)

# Give access to headers from src
target_include_directories(runTests PRIVATE ../src)

# Link gtest + your project's library
target_link_libraries(runTests
    project_lib
    gtest
    gtest_main
    pthread
)
