#include <map>
#include <string>
#include <iostream>

std::string MY_FILES= std::getenv("FILES_DIR");

int main() {
    std::cout << std::getenv("FILES_DIR") << std::endl;
    return 0;
}