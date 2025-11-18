#include "CLI_IO.h"
#include <iostream>
#include <sstream>

using namespace std;

string CLI_IO:: read() {
    getline(cin, this->line);
    stringstream ss(this->line);
    string command;
    ss >> command;
    return command;
}

string CLI_IO:: getLine() {
    stringstream ss(this->line);
    string command;
    string rest;
    ss >> command;
    getline(ss, rest);

    if (!rest.empty() && rest[0] == ' ') {
        rest.erase(0, 1);
    }
    return rest;
}

void CLI_IO:: write(const string& content) const {
    cout << content;
}
 