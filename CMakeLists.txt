cmake_minimum_required(VERSION 3.10)
project(AdvancedProject)

set(CMAKE_CXX_STANDARD 17)

# we created our project as a library so we can link our tests to our cpp files more easily
add_library(project_lib
    src/Add.cpp
    src/Get.cpp
    src/CLI_IO.cpp
    src/App.cpp
    src/RLE.cpp
    src/Search.cpp
    src/Globals.cpp
)

# Allow including src headers
target_include_directories(project_lib PUBLIC src)

# -----------------------------
# Main executable using the library
# -----------------------------
add_executable(runProject
    src/main.cpp
)

target_link_libraries(runProject project_lib)

# -----------------------------
# Enable tests directory
# -----------------------------
add_subdirectory(tests)
