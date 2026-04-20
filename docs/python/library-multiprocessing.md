---
sourceUrl: https://docs.python.org/3/library/multiprocessing.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

**Source code:** [Lib/multiprocessing/](https://github.com/python/cpython/tree/3.14/Lib/multiprocessing/)

* * *

## Introduction

`multiprocessing` is a package that supports spawning processes using an API similar to the `threading` module. The `multiprocessing` package offers both local and remote concurrency, effectively side-stepping the Global Interpreter Lock by using subprocesses instead of threads. Due to this, the `multiprocessing` module allows the programmer to fully leverage multiple processors on a given machine. It runs on both POSIX and Windows.

The `multiprocessing` module also introduces the `Pool` object which offers a convenient means of parallelizing the execution of a function across multiple input values, distributing the input data across processes (data parallelism).

```python
from multiprocessing import Pool

def f(x):
    return x*x

if __name__ == '__main__':
    with Pool(5) as p:
        print(p.map(f, [1, 2, 3]))
# Output: [1, 4, 9]
```

## The Process Class

In `multiprocessing`, processes are spawned by creating a `Process` object and then calling its `start()` method. `Process` follows the API of `threading.Thread`.

```python
from multiprocessing import Process

def f(name):
    print('hello', name)

if __name__ == '__main__':
    p = Process(target=f, args=('bob',))
    p.start()
    p.join()
```

## Contexts and Start Methods

Depending on the platform, `multiprocessing` supports three ways to start a process:

- **spawn** - The parent process starts a fresh Python interpreter process. The child process will only inherit those resources necessary to run the process object's `run()` method. Available on POSIX and Windows. The default on Windows and macOS.
- **fork** - The parent process uses `os.fork()` to fork the Python interpreter. All resources of the parent are inherited by the child process. Available on POSIX systems. Changed in version 3.14: This is no longer the default start method on any platform.
- **forkserver** - When the program starts and selects the forkserver start method, a server process is spawned. From then on, whenever a new process is needed, the parent process connects to the server and requests that it fork a new process. Available on POSIX platforms which support passing file descriptors over Unix pipes. The default on those (as of 3.14).

```python
import multiprocessing as mp

def foo(q):
    q.put('hello')

if __name__ == '__main__':
    mp.set_start_method('spawn')
    q = mp.Queue()
    p = mp.Process(target=foo, args=(q,))
    p.start()
    print(q.get())
    p.join()
```

## Exchanging Objects Between Processes

`multiprocessing` supports two types of communication channel between processes:

### Queues

The `Queue` class is a near clone of `queue.Queue`:

```python
from multiprocessing import Process, Queue

def f(q):
    q.put([42, None, 'hello'])

if __name__ == '__main__':
    q = Queue()
    p = Process(target=f, args=(q,))
    p.start()
    print(q.get())    # prints "[42, None, 'hello']"
    p.join()
```

### Pipes

The `Pipe()` function returns a pair of connection objects connected by a pipe which by default is duplex (two-way):

```python
from multiprocessing import Process, Pipe

def f(conn):
    conn.send([42, None, 'hello'])
    conn.close()

if __name__ == '__main__':
    parent_conn, child_conn = Pipe()
    p = Process(target=f, args=(child_conn,))
    p.start()
    print(parent_conn.recv())   # prints "[42, None, 'hello']"
    p.join()
```

## Synchronization Between Processes

`multiprocessing` contains equivalents of all the synchronization primitives from `threading`:

```python
from multiprocessing import Process, Lock

def f(l, i):
    l.acquire()
    try:
        print('hello world', i)
    finally:
        l.release()

if __name__ == '__main__':
    lock = Lock()
    for num in range(10):
        Process(target=f, args=(lock, num)).start()
```

## Sharing State Between Processes

### Shared Memory

Data can be stored in a shared memory map using `Value` or `Array`:

```python
from multiprocessing import Process, Value, Array

def f(n, a):
    n.value = 3.1415927
    for i in range(len(a)):
        a[i] = -a[i]

if __name__ == '__main__':
    num = Value('d', 0.0)
    arr = Array('i', range(10))
    p = Process(target=f, args=(num, arr))
    p.start()
    p.join()
    print(num.value)   # 3.1415927
    print(arr[:])      # [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
```

### Server Process (Manager)

A manager object returned by `Manager()` controls a server process which holds Python objects and allows other processes to manipulate them using proxies. Supports types: `list`, `dict`, `set`, `Namespace`, `Lock`, `RLock`, `Semaphore`, `BoundedSemaphore`, `Condition`, `Event`, `Barrier`, `Queue`, `Value` and `Array`.

## Using a Pool of Workers

The `Pool` class represents a pool of worker processes:

```python
from multiprocessing import Pool, TimeoutError
import time
import os

def f(x):
    return x*x

if __name__ == '__main__':
    with Pool(processes=4) as pool:
        print(pool.map(f, range(10)))

        for i in pool.imap_unordered(f, range(10)):
            print(i)

        res = pool.apply_async(f, (20,))
        print(res.get(timeout=1))  # prints "400"

        res = pool.apply_async(os.getpid, ())
        print(res.get(timeout=1))  # prints the PID

        multiple_results = [pool.apply_async(os.getpid, ()) for i in range(4)]
        print([res.get(timeout=1) for res in multiple_results])
```

## Reference

### class multiprocessing.Process(group=None, target=None, name=None, args=(), kwargs={}, *, daemon=None)

- **run()** - Method representing the process's activity.
- **start()** - Start the process's activity.
- **join([timeout])** - Block the calling process until the process whose join() method is called terminates or until the optional timeout occurs.
- **name** - The process's name.
- **is_alive()** - Return whether the process is alive.
- **daemon** - The process's daemon flag, a Boolean value.
- **pid** - Return the process ID.
- **exitcode** - The child's exit code. `None` if the process has not yet terminated.
- **authkey** - The process's authentication key (a byte string).
- **sentinel** - A numeric handle of a system object which will become "ready" when the process ends.
- **terminate()** - Terminate the process (sends SIGTERM on POSIX, TerminateProcess() on Windows).
- **kill()** - Same as `terminate()` but using the SIGKILL signal on POSIX.
- **close()** - Close the `Process` object, releasing all resources.

### multiprocessing.Queue([maxsize])

Returns a process shared queue implemented using a pipe and a few locks/semaphores.

- **qsize()** - Return the approximate size of the queue.
- **empty()** - Return `True` if the queue is empty, `False` otherwise.
- **full()** - Return `True` if the queue is full, `False` otherwise.
- **put(obj[, block[, timeout]])** - Put obj into the queue.
- **put_nowait(obj)** - Equivalent to `put(obj, False)`.
- **get([block[, timeout]])** - Remove and return an item from the queue.
- **get_nowait()** - Equivalent to `get(False)`.
- **close()** - Indicate that no more data will be put on this queue.
- **join_thread()** - Join the background thread.
- **cancel_join_thread()** - Prevent `join_thread()` from blocking.

### multiprocessing.Pipe([duplex])

Returns a pair `(conn1, conn2)` of `Connection` objects representing the ends of a pipe.

### multiprocessing.Pool([processes[, initializer[, initargs[, maxtasksperchild[, context]]]]])

A process pool object which controls a pool of worker processes.

- **apply(func[, args[, kwds]])** - Call *func* with arguments *args* and keyword arguments *kwds*, blocking until the result is ready.
- **apply_async(func[, args[, kwds[, callback[, error_callback]]]])** - Asynchronous version of `apply()`.
- **map(func, iterable[, chunksize])** - A parallel equivalent of the `map()` built-in function.
- **map_async(func, iterable[, chunksize[, callback[, error_callback]]])** - Asynchronous version of `map()`.
- **imap(func, iterable[, chunksize])** - A lazier version of `map()`.
- **imap_unordered(func, iterable[, chunksize])** - Same as `imap()` except that the ordering of the results is arbitrary.
- **starmap(func, iterable[, chunksize])** - Like `map()` except that the elements of the iterable are expected to be iterables that are unpacked as arguments.
- **starmap_async(func, iterable[, chunksize[, callback[, error_callback]]])** - Asynchronous version of `starmap()`.
- **close()** - Prevents any more tasks from being submitted to the pool.
- **terminate()** - Stops the worker processes immediately.
- **join()** - Wait for the worker processes to exit.

### Synchronization Primitives

- **multiprocessing.Lock** - A non-recursive lock object (same as `threading.Lock`).
- **multiprocessing.RLock** - A recursive lock object (same as `threading.RLock`).
- **multiprocessing.Semaphore([value])** - A semaphore object.
- **multiprocessing.BoundedSemaphore([value])** - A bounded semaphore object.
- **multiprocessing.Condition([lock])** - A condition variable.
- **multiprocessing.Event** - A clone of `threading.Event`.
- **multiprocessing.Barrier(parties[, action[, timeout]])** - A barrier object.
- **multiprocessing.Value(typecode_or_type, *args, lock=True)** - Return a ctypes object allocated from shared memory.
- **multiprocessing.Array(typecode_or_type, size_or_initializer, *, lock=True)** - Return a ctypes array allocated from shared memory.

## Programming Guidelines

- Make sure that the main module can be safely imported by a new Python interpreter. Use `if __name__ == '__main__':` guard.
- Avoid shared state. Use queues or pipes for communication.
- Picklability: Ensure that all arguments to methods of proxies and Process targets are picklable.
- Avoid terminating processes: Using `Process.terminate` on a process that is using a pipe or queue can corrupt the data.
- Joining zombie processes: On POSIX, when a process finishes but has not been joined, it becomes a zombie.
