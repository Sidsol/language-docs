---
sourceUrl: https://docs.python.org/3/howto/a-conceptual-overview-of-asyncio.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: howto
---

This [HOWTO](index.html#how-tos) article seeks to help you build a sturdy mental model of how [`asyncio`](../library/asyncio.html#module-asyncio "asyncio: Asynchronous I/O.") fundamentally works, helping you understand the how and why behind the recommended patterns.

You might be curious about some key `asyncio` concepts. By the end of this article, you'll be able to comfortably answer these questions:

*   What's happening behind the scenes when an object is awaited?
    
*   How does `asyncio` differentiate between a task which doesn't need CPU time (such as a network request or file read) as opposed to a task that does (such as computing n-factorial)?
    
*   How to write an asynchronous variant of an operation, such as an async sleep or database request.
    

See also

*   The [guide](https://github.com/anordin95/a-conceptual-overview-of-asyncio/tree/main) that inspired this HOWTO article, by Alexander Nordin.
    
*   This in-depth [YouTube tutorial series](https://www.youtube.com/watch?v=Xbl7XjFYsN4&list=PLhNSoGM2ik6SIkVGXWBwerucXjgP1rHmB) on `asyncio` created by Python core team member, Łukasz Langa.
    
*   [500 Lines or Less: A Web Crawler With asyncio Coroutines](https://aosabook.org/en/500L/a-web-crawler-with-asyncio-coroutines.html) by A. Jesse Jiryu Davis and Guido van Rossum.
    

## A conceptual overview part 1: the high-level

In part 1, we'll cover the main, high-level building blocks of `asyncio`: the event loop, coroutine functions, coroutine objects, tasks, and `await`.

### Event Loop

Everything in `asyncio` happens relative to the event loop. It's the star of the show. It's like an orchestra conductor. It's behind the scenes managing resources. Some power is explicitly granted to it, but a lot of its ability to get things done comes from the respect and cooperation of its worker bees.

In more technical terms, the event loop contains a collection of jobs to be run. Some jobs are added directly by you, and some indirectly by `asyncio`. The event loop takes a job from its backlog of work and invokes it (or "gives it control"), similar to calling a function, and then that job runs. Once it pauses or completes, it returns control to the event loop. The event loop will then select another job from its pool and invoke it. You can _roughly_ think of the collection of jobs as a queue: jobs are added and then processed one at a time, generally (but not always) in order. This process repeats indefinitely, with the event loop cycling endlessly onwards. If there are no more jobs pending execution, the event loop is smart enough to rest and avoid needlessly wasting CPU cycles, and will come back when there's more work to be done.

Effective execution relies on jobs sharing well and cooperating; a greedy job could hog control and leave the other jobs to starve, rendering the overall event loop approach rather useless.

```python
import asyncio

# This creates an event loop and indefinitely cycles through
# its collection of jobs.
event_loop = asyncio.new_event_loop()
event_loop.run_forever()
```

### Asynchronous functions and coroutines

This is a basic, boring Python function:

```python
def hello_printer():
    print(
        "Hi, I am a lowly, simple printer, though I have all I "
        "need in life -- \nfresh paper and my dearly beloved octopus "
        "partner in crime."
    )
```

Calling a regular function invokes its logic or body:

```
>>> hello_printer()
Hi, I am a lowly, simple printer, though I have all I need in life --
fresh paper and my dearly beloved octopus partner in crime.
```

The `async def`, as opposed to just a plain `def`, makes this an asynchronous function (or "coroutine function"). Calling it creates and returns a coroutine object.

```python
async def loudmouth_penguin(magic_number: int):
    print(
     "I am a super special talking penguin. Far cooler than that printer. "
     f"By the way, my lucky number is: {magic_number}."
    )
```

Calling the async function, `loudmouth_penguin`, does not execute the print statement; instead, it creates a coroutine object:

```
>>> loudmouth_penguin(magic_number=3)
<coroutine object loudmouth_penguin at 0x104ed2740>
```

The terms "coroutine function" and "coroutine object" are often conflated as coroutine. That can be confusing! In this article, coroutine specifically refers to a coroutine object, or more precisely, an instance of `types.CoroutineType` (native coroutine). Note that coroutines can also exist as instances of `collections.abc.Coroutine` – a distinction that matters for type checking.

A coroutine represents the function's body or logic. A coroutine has to be explicitly started; again, merely creating the coroutine does not start it. Notably, the coroutine can be paused and resumed at various points within the function's body. That pausing and resuming ability is what allows for asynchronous behavior!

Coroutines and coroutine functions were built by leveraging the functionality of generators and generator functions. Recall, a generator function is a function that `yield`s.

### Tasks

Roughly speaking, tasks are coroutines (not coroutine functions) tied to an event loop. A task also maintains a list of callback functions whose importance will become clear in a moment when we discuss `await`. The recommended way to create tasks is via `asyncio.create_task()`.

Creating a task automatically schedules it for execution (by adding a callback to run it in the event loop's to-do list, that is, collection of jobs).

`asyncio` automatically associates tasks with the event loop for you. This automatic association was purposely designed into `asyncio` for the sake of simplicity.

```python
coroutine = loudmouth_penguin(magic_number=5)
# This creates a Task object and schedules its execution via the event loop.
task = asyncio.create_task(coroutine)
```

Earlier, we manually created the event loop and set it to run forever. In practice, it's recommended to use `asyncio.run()`, which takes care of managing the event loop and ensuring the provided coroutine finishes before advancing.

```python
import asyncio

async def main():
    # Perform all sorts of wacky, wild asynchronous things...
    ...

if __name__ == "__main__":
    asyncio.run(main())
    print("coroutine main() is done!")
```

### await

`await` is a Python keyword that's commonly used in one of two different ways:

```python
await task
await coroutine
```

In a crucial way, the behavior of `await` depends on the type of object being awaited.

Awaiting a task will cede control from the current task or coroutine to the event loop. Awaiting a coroutine does **not** hand control back to the event loop. The behavior of `await coroutine` is effectively the same as invoking a regular, synchronous Python function.

## A conceptual overview part 2: the nuts and bolts

Part 2 goes into detail on the mechanisms `asyncio` uses to manage control flow.

### The inner workings of coroutines

`asyncio` leverages four components to pass around control:

- `coroutine.send(arg)` is the method used to start or resume a coroutine.
- `yield` pauses execution and returns control to the caller.
- `await` calls the `__await__()` method of the given object and propagates any `yield`s up the call chain.
- When a coroutine finishes, it raises a `StopIteration` exception with the return value attached.

### Futures

A future is an object meant to represent a computation's status and result. A future has a state (pending, cancelled, or done) and a result. `asyncio.Task` subclasses `asyncio.Future` to gain these capabilities.

### A homemade asyncio.sleep

Futures can be used to create custom asynchronous operations. By scheduling a callback via `event_loop.call_later()` that sets a future's result, you can create operations that pause for a specified duration without blocking the event loop.
