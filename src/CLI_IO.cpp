#include "CLI_IO.h"
#include <iostream>
#include <sstream>

using namespace std;
CLI_IO::CLI_IO() : line("") {}

// Reads a line from standard input and returns the first word as command
string CLI_IO:: read() {
    getline(cin, this->line);
    stringstream ss(this->line);
    string command;
    ss >> command;
    getline(ss, this->line); // Store the rest of the line for getLine()

    // Remove leading space from the remaining line
    if (!this->line.empty() && this->line[0] == ' ')
        this->line.erase(0, 1);
    
        return command;
}

string CLI_IO:: getLine() {

   return this->line;
}

void CLI_IO:: write(const string& content) const {
    cout << content;
}
 