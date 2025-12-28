#include <map>
#include <string>
#include <iostream>
#include "IO.h"
#include "CLI_IO.h"
#include "ICommand.h"
#include "Add.h"
#include "Get.h"
#include "Search.h"
#include "Delete.h"
#include "ICompress.h"
#include "RLE.h"
#include "App.h"
#include "IFileSystem.h"
#include "FileManager.h"
#include "Client_Thread_Executor.h"
#include "Runnable.h"
#include <memory>
#include "Server.h"
#include <unistd.h>

using namespace std;

int main() {
    Client_Thread_Executor executor;
    FileManager fs;
    RLE compressor;

    using CommandMap = map<string, unique_ptr<ICommand>>;
    CommandMap commands;

    commands["post"] = make_unique<Add>(compressor, fs);
    commands["get"] = make_unique<Get>(compressor, fs);
    commands["search"] = make_unique<Search>(compressor, fs);
    commands["delete"] = make_unique<Delete>(compressor, fs);

    Server server(8080, executor, commands);
    server.start();
    return 0;
}
