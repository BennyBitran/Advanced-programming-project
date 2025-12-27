#ifndef EXECUTOR_H
#define EXECUTOR_H
#include "Runnable.h"

#include <string>
#include <memory>

using namespace std;

class Executor
{
    public:

        virtual void execute(unique_ptr<Runnable> task) = 0;

        virtual ~Executor() = default;
        
};
#endif
