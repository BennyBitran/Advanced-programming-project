#include "Client_Thread_Executor.h"
#include "Runnable.h"
#include <thread>
#include <unistd.h>

using namespace std;

Client_Thread_Executor::Client_Thread_Executor() {}

void Client_Thread_Executor::execute(unique_ptr<Runnable> task) {
    //now cmd is the unique pointer to the runnable object, and run on the new thread
    thread t([cmd = move(task)]() {
        cmd->run();
    });
    /* detach the thread from the thread group so they can run independently */
    /* in our specific design the server doesnt need to wait for the clinet to finish */
    /* since the server should keep running */
    t.detach();
}