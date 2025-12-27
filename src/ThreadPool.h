#ifndef THREADPOOL_H
#define THREADPOOL_H

#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <atomic>
#include <memory>
#include "Runnable.h"
#include "Executor.h"

using namespace std;

class ThreadPool : public Executor
{
public:
    //constructor 
    ThreadPool(int numThreads);

    ~ThreadPool();

    void execute(unique_ptr<Runnable> task);

private:
    vector<thread> workers;
    queue<unique_ptr<Runnable>> tasks;
    
    mutex queueMutex;
    condition_variable condition;
    atomic<bool> stop;
};

#endif