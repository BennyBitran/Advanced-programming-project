#ifndef RUNNABLE_H
#define RUNNABLE_H

#include <string>

using namespace std;

class Runnable
{
    public:

        virtual void run() const = 0;

        virtual ~Runnable() = default;
        
};
#endif
