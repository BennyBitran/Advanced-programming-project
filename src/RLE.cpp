#include "RLE.h"
#include <iostream>
using namespace std;

RLE::RLE() {}

// this alg will use bytes to store the compressed data, one byte for the count and one byte for the character
string RLE::compress (const string& data) const {
    string compressed = "";
    compressed.reserve(data.size() * 2); // Reserve space to minimize reallocations
    if (data.empty()) return compressed;

    // Iterate through the input data
    for (int i = 0; i < data.size(); i++) {
        char currentChar = data[i];
        int count = 1;
        // Count occurrences of the current character, up to 255 (limit of a byte)
        while (i + 1 < data.size() && data[i + 1] == currentChar && count < 255) {
            count++;
            i++;
        }
        // Append the count as a single byte and the character to the compressed string
        compressed.push_back(char(count));
        compressed.push_back(currentChar);
    }
    return compressed;
}
//this alg will read two bytes at a time, the first byte is the count and the second byte is the character to be repeated
string RLE::decompress (const string& data) const {
    string decompressed = "";
    decompressed.reserve(data.size() * 5); // Reserve space to minimize reallocations, otherwise we will realloc every time we append
    if (data.empty()) return decompressed;
    // Iterate through the compressed data two bytes at a time
    for (int i = 0; i < data.size(); i += 2) {
        unsigned char count = static_cast<unsigned char>(data[i]); // Read the count as an unsigned char
        char currentChar = data[i + 1]; // Read the character
        // Append the character 'count' times to the decompressed string
        decompressed.append(count, currentChar);
    }
    return decompressed;
}

