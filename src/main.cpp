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
#include "ThreadPool.h"
#include "Runnable.h"
#include <memory>
#include "Server.h"
#include <unistd.h>

using namespace std;

int main(int argc, char* argv[]) {
    ThreadPool executor(stoi(argv[2]));
    FileManager fs;
    RLE compressor;

    using CommandMap = map<string, unique_ptr<ICommand>>;
    CommandMap commands;

    commands["post"] = make_unique<Add>(compressor, fs);
    commands["get"] = make_unique<Get>(compressor, fs);
    commands["search"] = make_unique<Search>(compressor, fs);
    commands["delete"] = make_unique<Delete>(fs);

    Server server(stoi(argv[1]), executor, commands);
    server.start();
    return 0;
}
