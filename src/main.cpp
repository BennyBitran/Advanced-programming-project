#include <map>
#include <string>
#include <iostream>
#include "IO.h"
#include "CLI_IO.h"
#include "ICommand.h"
#include "Add.h"
#include "Get.h"
#include "Search.h"
#include "ICompress.h"
#include "RLE.h"
#include "App.h"
#include "IFileSystem.h"
#include "FileManager.h"

using namespace std;

int main() {
    CLI_IO io;
    RLE compressor;
    FileManager fs;
    
    Add add(compressor, io, fs);
    Get get(compressor, io, fs);
    Search search(compressor, io, fs);

    map<string, ICommand*> commands;

    commands["add"] = &add;
    commands["get"] = &get;
    commands["search"] = &search;

    App app(io, commands);
    app.run();

    return 0;
}
