#ifndef CLIENT_THREAD_EXECUTOR_H
#define CLIENT_THREAD_EXECUTOR_H
#include "Runnable.h"
#include "Executor.h"

#include <string>

using namespace std;

class Client_Thread_Executor : public Executor
{
    public:
        
        Client_Thread_Executor();

        void execute(Runnable& command) override;

        ~Client_Thread_Executor() = default;
        
};

#endif
