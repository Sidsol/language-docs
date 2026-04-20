---
sourceUrl: https://docs.python.org/3/library/threading.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

**Source code:** [Lib/threading.py](https://github.com/python/cpython/tree/3.14/Lib/threading.py)

* * *

This module constructs higher-level threading interfaces on top of the lower level `_thread` module.

## Introduction

The `threading` module provides a way to run multiple threads (smaller units of a process) concurrently within a single process. It allows for the creation and management of threads, making it possible to execute tasks in parallel, sharing memory space. Threads are particularly useful when tasks are I/O bound, such as file operations or making network requests, where much of the time is spent waiting for external resources.

A typical use case for `threading` includes managing a pool of worker threads that can process multiple tasks concurrently. Here's a basic example:

```python
import threading
import time

def crawl(link, delay=3):
    print(f"crawl started for {link}")
    time.sleep(delay)  # Blocking I/O (simulating a network request)
    print(f"crawl ended for {link}")

links = [
    "https://python.org",
    "https://docs.python.org",
    "https://peps.python.org",
]

# Start threads for each link
threads = []
for link in links:
    t = threading.Thread(target=crawl, args=(link,), kwargs={"delay": 2})
    threads.append(t)

for t in threads:
    t.start()

for t in threads:
    t.join()
```

**CPython implementation detail:** In CPython, due to the Global Interpreter Lock, only one thread can execute Python code at once. If you want your application to make better use of the computational resources of multi-core machines, you are advised to use `multiprocessing` or `concurrent.futures.ProcessPoolExecutor`. However, threading is still an appropriate model if you want to run multiple I/O-bound tasks simultaneously.

## GIL and Performance Considerations

The GIL limits the performance gains of threading when it comes to CPU-bound tasks, as only one thread can execute Python bytecode at a time. As of Python 3.13, free-threaded builds can disable the GIL, enabling true parallel execution of threads (see PEP 703).

## Module-Level Functions

- **threading.active_count()** - Return the number of `Thread` objects currently alive.
- **threading.current_thread()** - Return the current `Thread` object, corresponding to the caller's thread of control.
- **threading.excepthook(args, /)** - Handle uncaught exception raised by `Thread.run()`.
- **threading.get_ident()** - Return the 'thread identifier' of the current thread.
- **threading.get_native_id()** - Return the native integral Thread ID of the current thread assigned by the kernel.
- **threading.enumerate()** - Return a list of all `Thread` objects currently active.
- **threading.main_thread()** - Return the main `Thread` object.
- **threading.settrace(func)** - Set a trace function for all threads started from the `threading` module.
- **threading.settrace_all_threads(func)** - Set a trace function for all threads started from the `threading` module and all Python threads that are currently executing. (Added in version 3.12)
- **threading.gettrace()** - Get the trace function as set by `settrace()`.
- **threading.setprofile(func)** - Set a profile function for all threads started from the `threading` module.
- **threading.setprofile_all_threads(func)** - Set a profile function for all threads. (Added in version 3.12)
- **threading.getprofile()** - Get the profiler function as set by `setprofile()`.
- **threading.stack_size([size])** - Return the thread stack size used when creating new threads.
- **threading.TIMEOUT_MAX** - The maximum value allowed for the *timeout* parameter of blocking functions.

## Thread-Local Data

Thread-local data is data whose values are thread specific. Create a `local` object and use its attributes:

```python
>>> mydata = threading.local()
>>> mydata.number = 42
>>> mydata.number
42
```

### class threading.local

A class that represents thread-local data.

## Thread Objects

The `Thread` class represents an activity that is run in a separate thread of control. There are two ways to specify the activity: by passing a callable object to the constructor, or by overriding the `run()` method in a subclass.

### class threading.Thread(group=None, target=None, name=None, args=(), kwargs={}, *, daemon=None, context=None)

- **start()** - Start the thread's activity. It must be called at most once per thread object.
- **run()** - Method representing the thread's activity. You may override this method in a subclass.
- **join(timeout=None)** - Wait until the thread terminates. This blocks the calling thread until the thread whose `join()` method is called terminates.
- **name** - A string used for identification purposes only. Multiple threads may be given the same name.
- **ident** - The 'thread identifier' of this thread or `None` if the thread has not been started.
- **native_id** - The Thread ID (TID) of this thread, as assigned by the OS (kernel). `None` if the thread has not been started.
- **is_alive()** - Return whether the thread is alive.
- **daemon** - A boolean value indicating whether this thread is a daemon thread (True) or not (False).

Note: Daemon threads are abruptly stopped at shutdown. Their resources (such as open files, database transactions, etc.) may not be released properly.

## Lock Objects

A primitive lock is a synchronization primitive that is not owned by a particular thread when locked.

### class threading.Lock

- **acquire(blocking=True, timeout=-1)** - Acquire a lock, blocking or non-blocking.
- **release()** - Release a lock. This can be called from any thread, not only the thread which has acquired the lock.
- **locked()** - Return `True` if the lock is acquired.

## RLock Objects

A reentrant lock is a synchronization primitive that may be acquired multiple times by the same thread.

### class threading.RLock

- **acquire(blocking=True, timeout=-1)** - Acquire a lock, blocking or non-blocking.
- **release()** - Release a lock, decrementing the recursion level.

## Condition Objects

A condition variable allows one or more threads to wait until they are notified by another thread.

### class threading.Condition(lock=None)

- **acquire(*args)** - Acquire the underlying lock.
- **release()** - Release the underlying lock.
- **wait(timeout=None)** - Wait until notified or until a timeout occurs.
- **wait_for(predicate, timeout=None)** - Wait until a condition evaluates to true.
- **notify(n=1)** - Wake up one or more threads waiting on this condition.
- **notify_all()** - Wake up all threads waiting on this condition.

## Semaphore Objects

### class threading.Semaphore(value=1)

- **acquire(blocking=True, timeout=None)** - Acquire a semaphore.
- **release(n=1)** - Release a semaphore, incrementing the internal counter by *n*.

### class threading.BoundedSemaphore(value=1)

Class implementing bounded semaphore objects. A bounded semaphore checks to make sure its current value doesn't exceed its initial value.

## Event Objects

An event manages a flag that can be set to true with the `set()` method and reset to false with the `clear()` method. The `wait()` method blocks until the flag is true.

### class threading.Event

- **is_set()** - Return `True` if and only if the internal flag is true.
- **set()** - Set the internal flag to true.
- **clear()** - Reset the internal flag to false.
- **wait(timeout=None)** - Block until the internal flag is true.

## Timer Objects

This class represents an action that should be run only after a certain amount of time has passed — a timer.

### class threading.Timer(interval, function, args=None, kwargs=None)

- **cancel()** - Stop the timer, and cancel the execution of the timer's action.

## Barrier Objects

A barrier provides a simple synchronization primitive for use by a fixed number of threads that need to wait for each other.

### class threading.Barrier(parties, action=None, timeout=None)

- **wait(timeout=None)** - Pass the barrier. Returns an integer in the range 0 to parties – 1.
- **reset()** - Return the barrier to the default, empty state.
- **abort()** - Put the barrier into a broken state.
- **parties** - The number of threads required to pass the barrier.
- **n_waiting** - The number of threads currently waiting in the barrier.
- **broken** - A boolean that is `True` if the barrier is in the broken state.
