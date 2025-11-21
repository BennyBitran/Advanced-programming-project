#ifndef MOCKS_H
#define MOCKS_H

#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../src/IO.h"
#include "../src/ICompress.h"
#include "../src/ICommand.h"

// mock class for io interface to isolate input/output operations
class MockIO : public IO {
public:
    MOCK_METHOD(std::string, getLine, (), (override));
    MOCK_METHOD(std::string, read, (), (override));
    MOCK_METHOD(void, write, (const std::string&), (const, override));
};

// mock class for compression interface to isolate rle logic
class MockCompress : public ICompress {
public:
    MOCK_METHOD(std::string, compress, (std::string), (override));
    MOCK_METHOD(std::string, decompress, (std::string), (override));
};

#endif // MOCKS_H