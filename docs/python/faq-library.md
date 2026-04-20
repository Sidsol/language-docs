---
sourceUrl: https://docs.python.org/3/faq/library.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: faq
---

# Library and Extension FAQ

## General Library Questions

### How do I find a module or application to perform task X?

Check the Library Reference for standard library modules. For third-party packages, search the Python Package Index (PyPI) at https://pypi.org.

### Where is the math.py (socket.py, regex.py, etc.) source file?

There are three kinds of modules in Python:
1. Modules written in Python (.py)
2. Modules written in C and dynamically loaded (.dll, .pyd, .so, .sl, etc)
3. Modules written in C and linked with the interpreter (check `sys.builtin_module_names`)

### How do I make a Python script executable on Unix?

The script file's mode must be executable and the first line must begin with `#!`:

```
#!/usr/bin/env python
```

### Is there a curses/termcap package for Python?

For Unix variants, the standard Python source distribution comes with a `curses` module. It supports basic curses features as well as many additional functions from ncurses. Not available on Windows.

### Is there an equivalent to C's onexit() in Python?

The `atexit` module provides a register function similar to C's `onexit()`.

### Why don't my signal handlers work?

Signal handlers must be declared with two parameters: `def handler(signum, frame)`.

## Common tasks

### How do I test a Python program or component?

Python comes with two testing frameworks:
- `doctest` module: finds examples in docstrings and runs them
- `unittest` module: fancier testing framework modelled on Java and Smalltalk testing frameworks

### How do I create documentation from doc strings?

Use the `pydoc` module for HTML from docstrings. Alternatives include epydoc and Sphinx.

## Threads

### How do I program using threads?

Use the `threading` module (not `_thread`). The `threading` module builds convenient abstractions on top of the low-level primitives.

### How do I parcel out work among a bunch of worker threads?

The easiest way is to use `concurrent.futures.ThreadPoolExecutor`. Alternatively, use a `queue.Queue` to create a job queue.

### What kinds of global value mutation are thread-safe?

The GIL ensures that only one thread runs in the Python VM at a time. Operations on shared variables of built-in data types that "look atomic" really are.

Atomic operations include: `L.append(x)`, `L1.extend(L2)`, `x = L[i]`, `x = L.pop()`, `D[x] = y`, `D1.update(D2)`.

Non-atomic operations include: `i = i+1`, `L.append(L[-1])`, `L[i] = L[j]`, `D[x] = D[x] + 1`.

### Can't we get rid of the Global Interpreter Lock?

With the approval of PEP 703, work is underway to remove the GIL from CPython. Python 3.13 is likely the first release containing this work. In the meantime, use multiple processes rather than threads for CPU-bound parallelism via `concurrent.futures.ProcessPoolExecutor`.

## Input and Output

### How do I delete a file?

Use `os.remove(filename)` or `os.unlink(filename)`.

### How do I copy a file?

Use `shutil.copy(src, dst)` or `shutil.copy2(src, dst)` (preserves metadata).

### How do I read (or write) binary data?

Use the `open()` function with `'rb'` or `'wb'` mode. Use `struct` module for packing/unpacking binary data.

### How do I access the serial (RS232) port?

Use the pySerial package (https://pypi.org/project/pyserial/).

## Network/Internet Programming

### What WWW tools are there for Python?

Standard library includes `urllib.request` for fetching URLs, `http.server` for building servers, and various modules for parsing HTML/XML. Popular third-party web frameworks include Django, Flask, and Tornado.

### How do I send mail from a Python script?

Use the `smtplib` module for sending mail and `email` module for constructing messages.

### How do I avoid blocking in the connect() method of a socket?

Use `select` module, or switch to non-blocking mode with `socket.setblocking(False)`.

## Databases

### Are there any interfaces to database packages in Python?

Yes. Python includes `sqlite3` for SQLite databases. DB-API 2.0 compatible interfaces exist for many databases. See https://wiki.python.org/moin/DatabaseInterfaces.

### How do you implement persistent objects in Python?

The `pickle` module converts objects to/from byte streams. The `shelve` module provides a persistent dictionary-like interface backed by `pickle` and `dbm`.

## Mathematics and Numerics

### How do I generate random numbers in Python?

Use the `random` module for pseudo-random numbers, or `secrets` module for cryptographically secure random numbers.
