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
#include "Client_Thread_Executor.h"
#include "Runnable.h"
#include <memory>
#include "Server.h"
#include <unistd.h>

using namespace std;

int main() {
    Client_Thread_Executor executor;
    FileManager filesystem;
    RLE compressor;
    Server server(8080, executor, compressor, filesystem);
    server.start();
    return 0;
}
