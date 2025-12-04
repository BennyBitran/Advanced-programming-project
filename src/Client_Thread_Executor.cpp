#include "Client_Thread_Executor.h"
#include "Runnable.h"
#include <thread>
#include <unistd.h>

using namespace std;

Client_Thread_Executor::Client_Thread_Executor() {}

void Client_Thread_Executor::execute(Runnable& command) {
    //create new Thread, pass the run method and the specific object to call the function on
    thread t(&Runnable::run, &command);
    
    /* detach the thread from the thread group so they can run independently */
    /* in our specific design the server doesnt need to wait for the clinet to finish */
    /* since the server should keep running */
    t.detach();
}