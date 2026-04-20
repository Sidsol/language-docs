---
sourceUrl: https://docs.python.org/3/library/sys.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

This module provides access to some variables used or maintained by the interpreter and to functions that interact strongly with the interpreter. It is always available.

## Key Variables

### Command Line and Environment

- **sys.argv** - The list of command line arguments passed to a Python script. `argv[0]` is the script name.
- **sys.orig_argv** - The list of the original command line arguments passed to the Python executable.
- **sys.executable** - A string giving the absolute path of the executable binary for the Python interpreter.
- **sys.prefix** - Set during Python startup, before `site.py` is run. Gives the site-specific directory prefix.
- **sys.exec_prefix** - Gives the site-specific directory prefix where platform-dependent Python files are installed.
- **sys.base_prefix** - The base Python installation prefix (doesn't change in virtual environments).
- **sys.path** - A list of strings that specifies the search path for modules.
- **sys.modules** - A dictionary mapping module names to modules which have already been loaded.
- **sys.builtin_module_names** - A tuple of strings containing the names of all modules compiled into the interpreter.
- **sys.stdlib_module_names** - A frozenset of strings containing the names of standard library modules.

### Platform and Version

- **sys.platform** - A string identifying the platform (e.g., `'linux'`, `'darwin'`, `'win32'`).
- **sys.version** - A string containing the version number of the Python interpreter.
- **sys.version_info** - A named tuple with components: *major*, *minor*, *micro*, *releaselevel*, *serial*.
- **sys.implementation** - Object containing information about the implementation of the currently running Python interpreter.
- **sys.byteorder** - `'big'` on big-endian platforms, `'little'` on little-endian.
- **sys.maxsize** - The largest positive integer supported by the platform's `Py_ssize_t` type.
- **sys.maxunicode** - The value of the largest Unicode code point (always `1114111` = `0x10FFFF`).
- **sys.float_info** - Named tuple holding information about the float type.
- **sys.int_info** - Named tuple holding information about the internal representation of integers.

### Standard I/O

- **sys.stdin** - Standard input stream.
- **sys.stdout** - Standard output stream.
- **sys.stderr** - Standard error stream.
- **sys.__stdin__** / **sys.__stdout__** / **sys.__stderr__** - Original values of stdin, stdout, stderr at the start of the program.

### Runtime

- **sys.flags** - Named tuple of command line flags (debug, inspect, interactive, optimize, etc.).
- **sys.dont_write_bytecode** - If true, Python won't write `.pyc` files on import.
- **sys.hash_info** - Named tuple giving parameters of the numeric hash implementation.
- **sys.copyright** - A string containing the copyright pertaining to the Python interpreter.
- **sys.api_version** - The C API version for this interpreter.
- **sys.winver** - The version number used to form registry keys on Windows.
- **sys.dllhandle** - Integer specifying the handle of the Python DLL (Windows).

### Recursion and Limits

- **sys.getrecursionlimit()** - Return the current value of the recursion limit.
- **sys.setrecursionlimit(limit)** - Set the maximum depth of the Python interpreter stack to *limit*.
- **sys.getswitchinterval()** - Return the interpreter's thread switch interval.
- **sys.setswitchinterval(interval)** - Set the interpreter's thread switch interval.

## Key Functions

### Exception Handling

- **sys.exc_info()** - Return a tuple `(type, value, traceback)` of the current exception being handled.
- **sys.exception()** - Return the exception instance currently being handled, or `None`. (Added 3.11)
- **sys.excepthook(type, value, traceback)** - Print a given traceback and exception to `sys.stderr`.
- **sys.unraisablehook(unraisable)** - Handle an unraisable exception. (Added 3.8)

### Tracing and Profiling

- **sys.settrace(tracefunc)** - Set the system's trace function.
- **sys.gettrace()** - Get the trace function as set by `settrace()`.
- **sys.setprofile(profilefunc)** - Set the system's profile function.
- **sys.getprofile()** - Get the profile function as set by `setprofile()`.

### Memory and Object Info

- **sys.getsizeof(object[, default])** - Return the size of an object in bytes.
- **sys.getrefcount(object)** - Return the reference count of the object.
- **sys.intern(string)** - Enter *string* in the table of "interned" strings and return the interned string.

### Exit

- **sys.exit([arg])** - Raise a `SystemExit` exception, signaling an intention to exit the interpreter.

### Auditing

- **sys.addaudithook(hook)** - Append the callable *hook* to the list of active auditing hooks. (Added 3.8)
- **sys.audit(event, *args)** - Raise an auditing event and trigger any active auditing hooks. (Added 3.8)

### Encoding

- **sys.getdefaultencoding()** - Return the name of the current default string encoding (usually `'utf-8'`).
- **sys.getfilesystemencoding()** - Return the name of the encoding used to convert between filenames and bytes filenames.
- **sys.getfilesystemencodeerrors()** - Get filesystem error mode.

### Other

- **sys._current_frames()** - Return a dictionary mapping each thread's identifier to the topmost stack frame (useful for debugging deadlocks).
- **sys._current_exceptions()** - Return a dictionary mapping each thread's identifier to the topmost exception currently active.
- **sys.breakpointhook()** - Called by built-in `breakpoint()`. By default drops into `pdb`.
- **sys.call_tracing(func, args)** - Call `func(*args)` while tracing is enabled.
- **sys.displayhook(value)** - Called to display the result of evaluating an expression in interactive mode.
- **sys.is_finalizing()** - Return `True` if the Python interpreter is shutting down.
- **sys.activate_stack_trampoline(backend, /)** - Activate the stack profiler trampoline. (Added 3.12)
- **sys.deactivate_stack_trampoline()** - Deactivate the current stack profiler trampoline backend. (Added 3.12)
