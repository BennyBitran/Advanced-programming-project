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
#include "Constants.h"

using namespace std;
//string MY_FILES=getenv("FILES_DIR");  #################uncomment when finished
//string MY_FILES="../files";     //###########remove this line when finished
int main() {
    IO* io = new CLI_IO();
    ICompress* compressor = new RLE();

    map<string, ICommand*> commands;
    commands["add"] = new Add(compressor, io);
    commands["get"] = new Get(compressor, io);
    commands["search"] = new Search(compressor, io);

    App app(io, commands);
    app.run();

    return 0;
}
