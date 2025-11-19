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
    ss >> command; // Extract the first word as command
    getline(ss, this->line); // Store the rest of the line for getLine()

    return command;
}

// Returns the rest of the line after the command
string CLI_IO:: getLine() {

   return this->line;
}
// Writes content to standard output
void CLI_IO:: write(const string& content) const {
    cout << content;
}
 