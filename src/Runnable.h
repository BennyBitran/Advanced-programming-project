#ifndef RUNNABLE_H
#define RUNNABLE_H

#include <string>

using namespace std;

class Runnable
{
    public:

        virtual void run() = 0;

        virtual ~Runnable() = default;
        
};
#endif