---
sourceUrl: https://docs.python.org/3/faq/programming.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: faq
---

# Programming FAQ

## General questions

### Is there a source code-level debugger with breakpoints and single-stepping?

Yes. Several debuggers are available: `pdb` (built-in console debugger), IDLE's graphical debugger, PythonWin, Eric, trepan3k, Visual Studio Code, Wing IDE, and PyCharm.

### Are there tools to help find bugs or perform static analysis?

Yes. Ruff, Pylint, and Pyflakes do basic checking. Static type checkers include mypy, ty, Pyrefly, and pytype.

### How can I create a stand-alone binary from a Python script?

Tools include: Nuitka, PyInstaller, PyOxidizer, cx_Freeze, py2app (macOS), and py2exe (Windows).

### Are there coding standards?

Yes. PEP 8 documents the coding style required for standard library modules.

## Core language

### Why am I getting an UnboundLocalError when the variable has a value?

When you make an assignment to a variable in a scope, that variable becomes local to that scope. Use `global` or `nonlocal` to access outer scope variables:

```python
x = 10
def foobar():
    global x
    print(x)
    x += 1
```

### What are the rules for local and global variables in Python?

Variables that are only referenced inside a function are implicitly global. If a variable is assigned anywhere within the function's body, it's assumed local unless explicitly declared as `global`.

### Why do lambdas defined in a loop with different values all return the same result?

The loop variable is not local to the lambda. Fix by saving values in default arguments:

```python
squares = []
for x in range(5):
    squares.append(lambda n=x: n**2)
```

### How do I share global variables across modules?

Create a special config module and import it in all modules of your application.

### What are the "best practices" for using import in a module?

Don't use `from modulename import *`. Import modules at the top of the file. Import in the order: standard library, third-party, local.

### Why are default values shared between objects?

Default values are created exactly once, when the function is defined. Use `None` as default and create new objects inside the function:

```python
def foo(mydict=None):
    if mydict is None:
        mydict = {}  # create a new dict each time
```

### Why did changing list 'y' also change list 'x'?

Variables in Python are names that refer to objects. Assignment doesn't copy data. Use slicing (`y = x[:]`), `list()`, or `copy.deepcopy()` to make copies.

### How do I copy an object in Python?

Use the `copy` module. `copy.copy(x)` makes a shallow copy. `copy.deepcopy(x)` makes a deep copy.

## Numbers and strings

### How do I specify hexadecimal and octal integers?

Use `0x` prefix for hex, `0o` for octal, `0b` for binary: `0xff`, `0o77`, `0b1010`.

### How do I convert a string to a number?

Use `int('144')` for integers, `float('3.14')` for floats.

### How do I modify a string in place?

You can't, because strings are immutable. Use `io.StringIO`, the `bytearray` type, or build a new string.

## Performance

### My program is too slow. How do I speed it up?

Use the `profile` module to find hotspots. Common tips:
- Use built-in operations (implicit looping in map, list comprehensions)
- Use local variables instead of global
- Use imports inside functions for rarely-used modules
- Consider C extensions for critical sections

### What is the most efficient way to concatenate many strings together?

Use `str.join()` method: `''.join(list_of_strings)`. For building up strings incrementally, appending to a list and joining at the end is efficient.

## Sequences (tuples/lists)

### What's a negative index?

Python sequences are indexed with positive numbers (0-based) and negative numbers. Negative indices count from the end: `seq[-1]` is the last element.

### How do I iterate over a sequence in reverse order?

Use the `reversed()` built-in function or slice notation `seq[::-1]`.

### How do you remove duplicates from a list?

Use `list(set(mylist))` (doesn't preserve order) or `list(dict.fromkeys(mylist))` (preserves order).

### How do I create a multidimensional list?

```python
# Correct way
A = [[None] * w for i in range(h)]

# WRONG - creates shared references
A = [[None] * w] * h
```

## Objects

### What is self?

`self` is merely a convention for the first argument of a method. A method defined as `meth(self, a, b, c)` should be called as `x.meth(a, b, c)` for instance `x`.

### How do I call a method defined in a base class from a derived class?

Use the `super()` built-in function: `super().__init__()`.

### How do I create static class data and static class methods?

Static data: define a class variable in the class body. Static methods: use the `@staticmethod` decorator.

## Modules

### How do I create a .pyc file?

Use the `py_compile` module or `compileall` module.

### How can I have modules that mutually import each other?

Move imports to the bottom of the module, or import inside functions.
