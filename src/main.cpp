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

using namespace std;
//string MY_FILES=getenv("FILES_DIR");  #################uncomment when finished

int main() {
    CLI_IO io;
    RLE compressor;
    
    Add add(compressor, io);
    Get get(compressor, io);
    Search search(compressor, io);

    map<string, ICommand*> commands;

    commands["add"] = &add;
    commands["get"] = &get;
    commands["search"] = &search;

    App app(io, commands);
    app.run();

    return 0;
}
