---
sourceUrl: https://docs.python.org/3/library/asyncio.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

asyncio is a library to write **concurrent** code using the **async/await** syntax.

asyncio is used as a foundation for multiple Python asynchronous frameworks that provide high-performance network and web-servers, database connection libraries, distributed task queues, etc.

asyncio is often a perfect fit for IO-bound and high-level **structured** network code.

## High-Level APIs

asyncio provides a set of **high-level** APIs to:

- [Run Python coroutines](https://docs.python.org/3/library/asyncio-task.html#coroutine) concurrently and have full control over their execution
- Perform [network IO and IPC](https://docs.python.org/3/library/asyncio-stream.html#asyncio-streams)
- Control [subprocesses](https://docs.python.org/3/library/asyncio-subprocess.html#asyncio-subprocess)
- Distribute tasks via [queues](https://docs.python.org/3/library/asyncio-queue.html#asyncio-queues)
- [Synchronize](https://docs.python.org/3/library/asyncio-sync.html#asyncio-sync) concurrent code

## Low-Level APIs

Additionally, there are **low-level** APIs for library and framework developers to:

- Create and manage [event loops](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio-event-loop), which provide asynchronous APIs for networking, running subprocesses, handling OS signals, etc.
- Implement efficient protocols using [transports](https://docs.python.org/3/library/asyncio-protocol.html#asyncio-transports-protocols)
- [Bridge](https://docs.python.org/3/library/asyncio-future.html#asyncio-futures) callback-based libraries and code with async/await syntax

## asyncio REPL

You can experiment with an `asyncio` concurrent context in the REPL:

```
$ python -m asyncio
asyncio REPL ...
Use "await" directly instead of "asyncio.run()".
>>> import asyncio
>>> await asyncio.sleep(10, result='hello')
'hello'
```

## Reference

The source code for asyncio can be found in [Lib/asyncio/](https://github.com/python/cpython/tree/3.14/Lib/asyncio/).

### Key Submodules

- **asyncio-task** - Coroutines, Tasks, and Futures
- **asyncio-stream** - Streams (high-level async/await API for network connections)
- **asyncio-subprocess** - Subprocesses
- **asyncio-sync** - Synchronization primitives (Lock, Event, Condition, Semaphore, Barrier)
- **asyncio-queue** - Queues
- **asyncio-eventloop** - Event Loop
- **asyncio-protocol** - Transports and Protocols
- **asyncio-future** - Futures
- **asyncio-platform-support** - Platform Support
- **asyncio-extending** - Extending asyncio
