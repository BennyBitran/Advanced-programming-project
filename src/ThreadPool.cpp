#include "ThreadPool.h"

using namespace std;

ThreadPool::ThreadPool(int numThreads) : stop(false) {
    for (int i = 0; i < numThreads; ++i) {
        //create and give a worker thread a "job" (the while loop)
        workers.emplace_back([this] {
            while (true) {
                unique_ptr<Runnable> task;
                {
                    //lock the queue so no 2 threads will run the same task
                    unique_lock<mutex> lock(queueMutex);
                    //check condition, if false - sleep (without burning cpu time) AND unlock the queue mutex
                    //if true - returns and goes on with locked queue mutex (stopping or tasks availible)
                    condition.wait(lock, [this] { return stop || !tasks.empty(); });

                    //exit condition: stop = true and no more tasks.
                    if (stop && tasks.empty()) {
                        return;
                    }

                    task = move(tasks.front());
                    tasks.pop();
                    //lock is out of scope so it unlocks automatically
                } 
                //run the task (if nothing failed and it exists)
                if (task) {
                    task->run();
                }
            }
        });
    }
}


void ThreadPool::execute(unique_ptr<Runnable> task) {
    {
        lock_guard<mutex> lock(queueMutex);
        //if we stop - dont add any task
        if (stop) return;
        
        tasks.push(move(task));
    }
    //wake up one sleeping thread to run the task 
    condition.notify_one();
}


ThreadPool::~ThreadPool() {
    {
        unique_lock<mutex> lock(queueMutex);
        stop = true;
    }
    //wake up all sleeping threads (on the condition wait) so they will return and exit
    condition.notify_all();

    //join all working threads
    for (thread &worker : workers) {
        if (worker.joinable()) {
            worker.join();
        }
    }
}