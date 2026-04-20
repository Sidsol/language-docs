---
sourceUrl: https://docs.python.org/3/library/subprocess.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

**Source code:** [Lib/subprocess.py](https://github.com/python/cpython/tree/3.14/Lib/subprocess.py)

* * *

The `subprocess` module allows you to spawn new processes, connect to their input/output/error pipes, and obtain their return codes. This module intends to replace several older modules and functions:

os.system
os.spawn\*

Information about how the `subprocess` module can be used to replace these modules and functions can be found in the following sections.

See also

[**PEP 324**](https://peps.python.org/pep-0324/) – PEP proposing the subprocess module

## Using the `subprocess` Module

The recommended approach to invoking subprocesses is to use the `run()` function for all use cases it can handle. For more advanced use cases, the underlying `Popen` interface can be used directly.

### subprocess.run

```python
subprocess.run(args, *, stdin=None, input=None, stdout=None, stderr=None,
               capture_output=False, shell=False, cwd=None, timeout=None,
               check=False, encoding=None, errors=None, text=None, env=None,
               universal_newlines=None, **other_popen_kwargs)
```

Run the command described by *args*. Wait for command to complete, then return a `CompletedProcess` instance.

The arguments shown above are merely the most common ones. The full function signature is largely the same as that of the `Popen` constructor - most of the arguments to this function are passed through to that interface. (*timeout*, *input*, *check*, and *capture_output* are not.)

If *capture_output* is true, stdout and stderr will be captured. When used, the internal `Popen` object is automatically created with *stdout* and *stderr* both set to `PIPE`. The *stdout* and *stderr* arguments may not be supplied at the same time as *capture_output*.

A *timeout* may be specified in seconds, it is internally passed on to `Popen.communicate()`. If the timeout expires, the child process will be killed and waited for. The `TimeoutExpired` exception will be re-raised after the child process has terminated.

The *input* argument is passed to `Popen.communicate()` and thus to the subprocess's stdin. If used it must be a byte sequence, or a string if *encoding* or *errors* is specified or *text* is true.

If *check* is true, and the process exits with a non-zero exit code, a `CalledProcessError` exception will be raised.

If *encoding* or *errors* are specified, or *text* is true, file objects for stdin, stdout and stderr are opened in text mode using the specified *encoding* and *errors* or the `io.TextIOWrapper` default.

If *env* is not `None`, it must be a mapping that defines the environment variables for the new process; these are used instead of the default behavior of inheriting the current process' environment.

Examples:

```python
>>> subprocess.run(["ls", "-l"])  # doesn't capture output
CompletedProcess(args=['ls', '-l'], returncode=0)

>>> subprocess.run("exit 1", shell=True, check=True)
Traceback (most recent call last):
  ...
subprocess.CalledProcessError: Command 'exit 1' returned non-zero exit status 1

>>> subprocess.run(["ls", "-l", "/dev/null"], capture_output=True)
CompletedProcess(args=['ls', '-l', '/dev/null'], returncode=0,
stdout=b'crw-rw-rw- 1 root root 1, 3 Jan 23 16:23 /dev/null\n', stderr=b'')
```

Added in version 3.5.

### class subprocess.CompletedProcess

The return value from `run()`, representing a process that has finished.

- **args** - The arguments used to launch the process. This may be a list or a string.
- **returncode** - Exit status of the child process. Typically, an exit status of 0 indicates that it ran successfully. A negative value `-N` indicates that the child was terminated by signal `N` (POSIX only).
- **stdout** - Captured stdout from the child process. A bytes sequence, or a string if `run()` was called with an encoding, errors, or text=True. `None` if stdout was not captured.
- **stderr** - Captured stderr from the child process. A bytes sequence, or a string if `run()` was called with an encoding, errors, or text=True. `None` if stderr was not captured.
- **check_returncode()** - If `returncode` is non-zero, raise a `CalledProcessError`.

### Constants

- **subprocess.DEVNULL** - Special value that can be used as the *stdin*, *stdout* or *stderr* argument to `Popen` and indicates that the special file `os.devnull` will be used.
- **subprocess.PIPE** - Special value that can be used as the *stdin*, *stdout* or *stderr* argument to `Popen` and indicates that a pipe to the standard stream should be opened.
- **subprocess.STDOUT** - Special value that can be used as the *stderr* argument to `Popen` and indicates that standard error should go into the same handle as standard output.

### Exceptions

- **subprocess.SubprocessError** - Base class for all other exceptions from this module.
- **subprocess.TimeoutExpired** - Subclass of `SubprocessError`, raised when a timeout expires while waiting for a child process.
  - `cmd` - Command that was used to spawn the child process.
  - `timeout` - Timeout in seconds.
  - `output` - Output of the child process if it was captured by `run()` or `check_output()`. Otherwise, `None`.
  - `stdout` - Alias for output.
  - `stderr` - Stderr output of the child process if it was captured.
- **subprocess.CalledProcessError** - Subclass of `SubprocessError`, raised when a process run by `check_call()`, `check_output()`, or `run()` (with `check=True`) returns a non-zero exit status.
  - `returncode` - Exit status of the child process.
  - `cmd` - Command that was used to spawn the child process.
  - `output` - Output of the child process if it was captured.
  - `stdout` - Alias for output.
  - `stderr` - Stderr output of the child process if it was captured.

### Frequently Used Arguments

- *args* is required for all calls and should be a string, or a sequence of program arguments. Providing a sequence of arguments is generally preferred.
- *stdin*, *stdout* and *stderr* specify the executed program's standard input, standard output and standard error file handles. Valid values are `None`, `PIPE`, `DEVNULL`, an existing file descriptor (a positive integer), and an existing file object with a valid file descriptor.
- If *encoding* or *errors* are specified, or *text* is true, the file objects *stdin*, *stdout* and *stderr* will be opened in text mode.
- If *shell* is `True`, the specified command will be executed through the shell.

### Popen Constructor

```python
class subprocess.Popen(args, bufsize=-1, executable=None, stdin=None,
                       stdout=None, stderr=None, preexec_fn=None,
                       close_fds=True, shell=False, cwd=None, env=None,
                       universal_newlines=None, startupinfo=None,
                       creationflags=0, restore_signals=True,
                       start_new_session=False, pass_fds=(),
                       *, group=None, extra_groups=None, user=None,
                       umask=-1, encoding=None, errors=None, text=None,
                       pipesize=-1, process_group=None)
```

Execute a child program in a new process. On POSIX, the class uses `os.execvpe()`-like behavior to execute the child program. On Windows, the class uses the Windows `CreateProcess()` function.

*args* should be a sequence of program arguments or else a single string or path-like object. By default, the program to execute is the first item in *args* if *args* is a sequence.

### Popen Methods

- **Popen.poll()** - Check if child process has terminated. Set and return `returncode` attribute.
- **Popen.wait(timeout=None)** - Wait for child process to terminate. Set and return `returncode` attribute.
- **Popen.communicate(input=None, timeout=None)** - Interact with process: Send data to stdin. Read data from stdout and stderr, until end-of-file is reached. Wait for process to terminate and set the `returncode` attribute. Returns a tuple `(stdout_data, stderr_data)`.
- **Popen.send_signal(signal)** - Sends the signal *signal* to the child.
- **Popen.terminate()** - Stop the child. On POSIX, sends SIGTERM. On Windows, calls TerminateProcess().
- **Popen.kill()** - Kills the child. On POSIX, sends SIGKILL. On Windows, same as `terminate()`.

### Popen Attributes

- **Popen.args** - The *args* argument as it was passed to `Popen`.
- **Popen.stdin** - If the *stdin* argument was `PIPE`, this attribute is a writeable stream object.
- **Popen.stdout** - If the *stdout* argument was `PIPE`, this attribute is a readable stream object.
- **Popen.stderr** - If the *stderr* argument was `PIPE`, this attribute is a readable stream object.
- **Popen.pid** - The process ID of the child process.
- **Popen.returncode** - The child return code, set by `poll()` and `wait()`. A `None` value indicates that the process hasn't terminated yet.

### Security Considerations

Unlike some other popen functions, this implementation will never implicitly call a system shell. This means that all characters, including shell metacharacters, can safely be passed to child processes. If the shell is invoked explicitly via `shell=True`, it is the application's responsibility to ensure that all whitespace and metacharacters are quoted appropriately to avoid shell injection vulnerabilities.

When using `shell=True`, the `shlex.quote()` function can be used to properly escape whitespace and shell metacharacters in strings that are going to be used to construct shell commands.
