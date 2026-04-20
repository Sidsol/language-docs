---
sourceUrl: https://docs.python.org/3/faq/windows.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: faq
---

# Python on Windows FAQ

## How do I run a Python program under Windows?

Open a Command prompt window (search for `cmd`), then use the `py` command:

```
C:\Users\YourName> py Desktop\hello.py
hello
```

You can also start the interactive interpreter:

```
C:\Users\YourName> py
Python 3.x.x ...
>>> print("Hello")
Hello
```

## How do I make Python scripts executable?

On Windows, the standard Python installer already associates the `.py` extension with a file type (Python.File) and gives that file type an open command that runs the interpreter. To execute scripts by simple typing 'foo' without extension, add `.py` to the `PATHEXT` environment variable.

## Why does Python sometimes take so long to start?

Usually Python starts very quickly on Windows. Slow starts may be caused by misconfigured virus checking software. Some virus scanners introduce significant startup overhead when configured to monitor all reads from the filesystem.

## How do I make an executable from a Python script?

Tools include Nuitka, PyInstaller, PyOxidizer, cx_Freeze, py2app (macOS), and py2exe (Windows).

## Is a *.pyd file the same as a DLL?

Yes, .pyd files are DLLs, but with some differences:
- A DLL named `foo.pyd` must have a function `PyInit_foo()`
- The search path is PYTHONPATH, not the Windows DLL search path
- You don't link your .exe with foo.lib

## How can I embed Python into a Windows application?

Key points:
1. Do **not** build Python into your .exe file directly. Link to `pythonNN.dll` instead.
2. Use SWIG to create a Python extension module that makes the app's data available to Python.
3. Initialize the Python interpreter with your extension module:

```c
#include <Python.h>
Py_Initialize();
initmyAppc();
PyRun_SimpleString("import myApp");
```

## How do I keep editors from inserting tabs into my Python source?

PEP 8 recommends 4 spaces for distributed Python code. Configure your editor to use spaces instead of tabs. Python raises `IndentationError` or `TabError` if mixed tabs and spaces cause problems. Use the `tabnanny` module to check files.

## How do I check for a keypress without blocking?

Use the `msvcrt` module (Windows-specific). It provides `kbhit()` to check for a keyboard hit and `getch()` to get one character without echoing.

## How do I solve the missing api-ms-win-crt-runtime-l1-1-0.dll error?

This can occur on Python 3.5+ with Windows 8.1 or earlier without all updates. Ensure your OS is up to date, or visit the Microsoft support page for manual C Runtime installation.
