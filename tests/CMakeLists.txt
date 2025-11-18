include(FetchContent)

FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/v1.15.0.zip
)

# For Windows
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)

FetchContent_MakeAvailable(googletest)


add_executable(unit_tests
    test_rle_compressor.cpp
    # after test_*.cpp
)

target_link_libraries(unit_tests
    PRIVATE
        cloud_core      
        GTest::gtest_main
)

include(GoogleTest)
gtest_discover_tests(unit_tests)
