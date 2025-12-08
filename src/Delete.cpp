#include "Delete.h"
#include "FilesystemExceptions.h"
#include <sstream>

using namespace std;

Delete::Delete(const ICompress& comp, IO& ioHandler, IFileSystem& fileSystem)
    : compressor(comp), io(ioHandler), fs(fileSystem) {}

// DELETE [file name]
void Delete::execute() {
    // Read the argument part of the command from IO
    string argument = io.getLine();

    // Remove a single leading space if present
    if (!argument.empty() && argument[0] == ' ') {
        io.write("400 Bad Request");
        return;
    }

    // First token should be the file name
    istringstream inStream(argument);
    string fileName;
    inStream >> fileName;

    // Save the rest of the line to detect unwanted extra arguments
    string restOfLine;
    getline(inStream, restOfLine);

    // If no file name provided or extra arguments exist -> 400
    if (fileName.empty() || !restOfLine.empty()) {
        io.write("400 Bad Request");
        return;
    }

    try {
        fs.deleteFile(fileName);
        io.write("204 No Content");
    } catch (const FileNotFoundException&) {
        io.write("404 Not Found");
    } catch (const std::exception&) {
        // Any other filesystem/logic error -> 500
        io.write("500 Internal Server Error");
    }
}
