#ifndef CLIENT_THREAD_EXECUTOR_H
#define CLIENT_THREAD_EXECUTOR_H
#include "Runnable.h"
#include "Executor.h"
#include <memory>
#include <string>

using namespace std;

class Client_Thread_Executor : public Executor
{
    public:
        
        Client_Thread_Executor();

        void execute(unique_ptr<Runnable> task) override;

        ~Client_Thread_Executor() = default;
        
};

#endif
