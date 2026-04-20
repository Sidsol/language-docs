---
sourceUrl: https://docs.python.org/3/faq/extending.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: faq
---

# Extending/Embedding FAQ

## Can I create my own functions in C?

Yes, you can create built-in modules containing functions, variables, exceptions and even new types in C. This is explained in the document "Extending and Embedding the Python Interpreter."

## Can I create my own functions in C++?

Yes, using the C compatibility features found in C++. Place `extern "C" { ... }` around the Python include files and put `extern "C"` before each function that is going to be called by the Python interpreter.

## Writing C is hard; are there any alternatives?

There are a number of alternatives to writing your own C extensions, depending on what you're trying to do. Recommended third party tools offer both simpler and more sophisticated approaches to creating C and C++ extensions for Python.

## How can I execute arbitrary Python statements from C?

The highest-level function is `PyRun_SimpleString()` which takes a single string argument to be executed in the context of the module `__main__` and returns `0` for success and `-1` when an exception occurred.

## How can I evaluate an arbitrary Python expression from C?

Call `PyRun_String()` with the start symbol `Py_eval_input`; it parses an expression, evaluates it and returns its value.

## How do I extract C values from a Python object?

Use the appropriate `PyXxx_AsYyy()` function, e.g., `PyLong_AsLong()`, `PyFloat_AsDouble()`, `PyUnicode_AsUTF8()`.

## How do I use Py_BuildValue() to create a tuple of arbitrary length?

You can't. Use `PyTuple_Pack()` instead.

## How do I call an object's method from C?

Use `PyObject_CallMethod()`:

```c
PyObject *
PyObject_CallMethod(PyObject *object, const char *method_name,
                    const char *arg_format, ...);
```

Example calling a file object's "seek" method:

```c
res = PyObject_CallMethod(f, "seek", "(ii)", 10, 0);
if (res == NULL) {
    /* an exception occurred */
}
else {
    Py_DECREF(res);
}
```

## How do I catch the output from PyErr_Print()?

In Python code, define an object with a `write()` method, then assign it to `sys.stdout` and `sys.stderr`:

```python
import io, sys
sys.stdout = io.StringIO()
print('foo')
print('hello world!')
sys.stderr.write(sys.stdout.getvalue())
```

## How do I access a module written in Python from C?

```c
module = PyImport_ImportModule("<modulename>");
```

Then access attributes with:

```c
attr = PyObject_GetAttrString(module, "<attrname>");
```

## How do I interface to C++ objects from Python?

Manually: read the "Extending and Embedding" document. The strategy of building a new Python type around a C structure type also works for C++ objects. Also see third-party tools like Boost Python Library, pybind11, SWIG, etc.

## How do I debug an extension?

When using GDB with dynamically loaded extensions, you can't set a breakpoint in your extension until it's loaded. Use:

```
br _PyImport_LoadDynamicModule
```

Then continue until your extension is loaded.

## I want to compile a Python module on my Linux system, but some files are missing. Why?

Most packaged versions of Python omit development files. For Red Hat, install `python3-devel`. For Debian, run `apt-get install python3-dev`.

## How do I tell "incomplete input" from "invalid input"?

Use the `codeop` module, which approximates the parser's behavior. IDLE uses this.

## Can I create an object class with some methods in C and others in Python?

Yes, you can inherit from built-in classes such as `int`, `list`, `dict`, etc. The Boost Python Library also provides a way of doing this from C++.
