---
sourceUrl: https://docs.python.org/3/library/contextlib.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

**Source code:** [Lib/contextlib.py](https://github.com/python/cpython/tree/3.14/Lib/contextlib.py)

* * *

This module provides utilities for common tasks involving the `with` statement.

## Abstract Base Classes

### class contextlib.AbstractContextManager (Added 3.6)

An abstract base class for classes that implement `__enter__()` and `__exit__()`. A default implementation for `__enter__()` is provided which returns `self`.

### class contextlib.AbstractAsyncContextManager (Added 3.7)

An abstract base class for classes that implement `__aenter__()` and `__aexit__()`.

## Decorators

### @contextlib.contextmanager

A decorator that can be used to define a factory function for `with` statement context managers, without needing to create a class or separate `__enter__()` and `__exit__()` methods.

```python
from contextlib import contextmanager

@contextmanager
def managed_resource(*args, **kwds):
    resource = acquire_resource(*args, **kwds)
    try:
        yield resource
    finally:
        release_resource(resource)

with managed_resource(timeout=3600) as resource:
    # Resource is released at the end of this block
    pass
```

The function being decorated must return a generator-iterator that yields exactly one value, which will be bound to the target in the `as` clause.

Context managers created with `contextmanager` can be used as decorators as well as in `with` statements.

### @contextlib.asynccontextmanager (Added 3.7)

Similar to `contextmanager()`, but creates an asynchronous context manager for use with `async with` statements.

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def get_connection():
    conn = await acquire_db_connection()
    try:
        yield conn
    finally:
        await release_db_connection(conn)

async def get_all_users():
    async with get_connection() as conn:
        return conn.query('SELECT ...')
```

## Context Manager Utilities

### contextlib.closing(thing)

Return a context manager that closes *thing* upon completion of the block:

```python
from contextlib import closing
from urllib.request import urlopen

with closing(urlopen('https://www.python.org')) as page:
    for line in page:
        print(line)
```

### contextlib.aclosing(thing) (Added 3.10)

Return an async context manager that calls the `aclose()` method of *thing* upon completion.

### contextlib.nullcontext(enter_result=None) (Added 3.7)

Return a context manager that returns *enter_result* from `__enter__()`, but otherwise does nothing. Used as a stand-in for an optional context manager:

```python
def process_file(file_or_path):
    if isinstance(file_or_path, str):
        cm = open(file_or_path)
    else:
        cm = nullcontext(file_or_path)

    with cm as file:
        # Perform processing on the file
        pass
```

Also works as an async context manager.

### contextlib.suppress(*exceptions) (Added 3.4)

Return a context manager that suppresses any of the specified exceptions:

```python
from contextlib import suppress

with suppress(FileNotFoundError):
    os.remove('somefile.tmp')
```

### contextlib.redirect_stdout(new_target) (Added 3.4)

Context manager for temporarily redirecting `sys.stdout`:

```python
import io
from contextlib import redirect_stdout

with redirect_stdout(io.StringIO()) as f:
    help(pow)
s = f.getvalue()
```

### contextlib.redirect_stderr(new_target) (Added 3.5)

Similar to `redirect_stdout()` but redirecting `sys.stderr`.

### contextlib.chdir(path) (Added 3.11)

Context manager to change the current working directory. Restores the old one on exit.

## Decorator Base Classes

### class contextlib.ContextDecorator

A base class that enables a context manager to also be used as a decorator:

```python
from contextlib import ContextDecorator

class mycontext(ContextDecorator):
    def __enter__(self):
        print('Starting')
        return self

    def __exit__(self, *exc):
        print('Finishing')
        return False

@mycontext()
def function():
    print('The bit in the middle')

# Can also be used as:
with mycontext():
    print('The bit in the middle')
```

### class contextlib.AsyncContextDecorator (Added 3.10)

Similar to `ContextDecorator` but for asynchronous functions.

## Exit Stack

### class contextlib.ExitStack

A context manager designed to make it easy to programmatically combine other context managers and cleanup functions:

```python
from contextlib import ExitStack

with ExitStack() as stack:
    files = [stack.enter_context(open(fname)) for fname in filenames]
    # All opened files will automatically be closed at the end
```

**Methods:**

- **enter_context(cm)** - Enters a new context manager and adds its `__exit__()` method to the callback stack.
- **push(exit)** - Adds a context manager's `__exit__()` method to the callback stack.
- **callback(callback, /, *args, **kwds)** - Accepts an arbitrary callback function and arguments and adds it to the callback stack.
- **pop_all()** - Transfers the callback stack to a fresh `ExitStack` instance and returns it.
- **close()** - Immediately unwinds the callback stack.

### class contextlib.AsyncExitStack (Added 3.7)

Similar to `ExitStack` but for async context managers:

**Methods:**

- **enter_async_context(cm)** - Enters an async context manager.
- **push_async_exit(exit)** - Accepts async context managers.
- **push_async_callback(callback, /, *args, **kwds)** - Accepts async callback functions.
- **aclose()** - Async version of `close()`.

## Reentrant vs Single Use

**Reentrant** context managers can be used more than once and in nested `with` statements:
- `redirect_stdout()`, `redirect_stderr()`, `suppress()`, `chdir()`

**Reusable** context managers can be used more than once but are not safe for nested use:
- Most are reusable but not reentrant.

**Single use** context managers can only be used once:
- `contextmanager()` and `asynccontextmanager()` create single-use context managers (but when used as decorators, a new instance is created per call).
