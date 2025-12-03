#ifndef EXECUTOR_H
#define EXECUTOR_H
#include "Runnable.h"

#include <string>

using namespace std;

class Executor
{
    public:

        virtual void execute(Runnable& command) const = 0;

        virtual ~Executor() = default;
        
};
#endif
