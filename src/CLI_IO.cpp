#include "CLI_IO.h"
#include <iostream>
#include <sstream>

using namespace std;
CLI_IO::CLI_IO() : input(cin), output(cout), line("") {}

CLI_IO::CLI_IO(istream& in, ostream& out) : input(in), output(out), line("") {} 

// Reads a line from standard input and returns the first word as command
string CLI_IO:: read() {
    getline(input, this->line);
    stringstream ss(this->line);
    string command;
    ss >> command; // Extract the first word as command
    ss.ignore(1) ; // Ignore the space after the command
    getline(ss, this->line); // Store the rest of the line for getLine()

        return command;
}

// Returns the rest of the line after the command
string CLI_IO:: getLine() const {

   return this->line;
}
// Writes content to standard output
void CLI_IO:: write(const string& content) const {
    output << content;
}
 