add_library(cloud_core
    RLECompressor.cpp
    Add.cpp
    Get.cpp
    Search.cpp
    Config.cpp
)

target_include_directories(cloud_core PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})