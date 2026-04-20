---
sourceUrl: https://docs.python.org/3/glossary.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: glossary
---

# Python Glossary

## `>>>`
The default Python prompt of the interactive shell. Often seen for code examples which can be executed interactively in the interpreter.

## `...`
The default Python prompt of the interactive shell when entering code for an indented code block, or the Ellipsis object.

## abstract base class
Abstract base classes complement duck-typing by providing a way to define interfaces. ABCs introduce virtual subclasses, which are classes that don't inherit from a class but are still recognized by `isinstance()` and `issubclass()`. See the `abc` module. Python comes with many built-in ABCs in `collections.abc`, `numbers`, `io`, and `importlib.abc`.

## annotation
A label associated with a variable, a class attribute or a function parameter or return value, used by convention as a type hint. Access annotations via `annotationlib.get_annotations()` (3.14+) or `inspect.get_annotations()` (3.10+).

## argument
A value passed to a function (or method) when calling the function. Two kinds:
- **keyword argument**: preceded by an identifier (e.g. `name=`) or passed via `**dict`
- **positional argument**: not a keyword argument; can appear at the beginning or be passed via `*iterable`

## asynchronous context manager
An object which controls the environment seen in an `async with` statement by defining `__aenter__()` and `__aexit__()` methods. Introduced by PEP 492.

## asynchronous generator
A function which returns an asynchronous generator iterator. Defined with `async def` and contains `yield` expressions for producing values usable in an `async for` loop.

## asynchronous iterator
An object that implements `__aiter__()` and `__anext__()` methods. `__anext__()` must return an awaitable. Introduced by PEP 492.

## awaitable
An object that can be used in an `await` expression. Can be a coroutine or an object with an `__await__()` method.

## BDFL
Benevolent Dictator For Life, a.k.a. Guido van Rossum, Python's creator.

## binary file
A file object able to read and write bytes-like objects. Examples: files opened in binary mode (`'rb'`, `'wb'`), `sys.stdin.buffer`, `io.BytesIO`.

## bytecode
Python source code is compiled into bytecode, the internal representation of a Python program in the CPython interpreter. Cached in `.pyc` files.

## callable
An object that can be called. A function, method, or instance of a class with `__call__()` method.

## class
A template for creating user-defined objects. Class definitions normally contain method definitions which operate on instances of the class.

## class variable
A variable defined in a class and intended to be modified only at class level (not in an instance).

## closure variable
A free variable referenced from a nested scope that is defined in an outer scope. May be explicitly defined with `nonlocal`.

## complex number
An extension of real numbers expressed as a sum of real and imaginary parts. Written with `j` suffix: `3+1j`.

## context manager
An object which implements `__enter__()` and `__exit__()` methods and controls the environment seen in a `with` statement. See PEP 343.

## coroutine
A more generalized form of subroutines that can be entered, exited, and resumed at many different points. Implemented with `async def`. See PEP 492.

## CPython
The canonical implementation of Python, as distributed on python.org.

## decorator
A function returning another function, usually applied as a function transformation using the `@wrapper` syntax. Common examples: `@classmethod`, `@staticmethod`, `@property`.

## descriptor
Any object which defines `__get__()`, `__set__()`, or `__delete__()`. They are the basis for many features including functions, methods, properties, class methods, static methods.

## dictionary
An associative array, where arbitrary keys are mapped to values. Keys must have `__hash__()` and `__eq__()` methods.

## dictionary comprehension
Compact way to create a dictionary: `{n: n ** 2 for n in range(10)}`.

## docstring
A string literal which appears as the first expression in a class, function or module. Put into the `__doc__` attribute.

## duck-typing
A programming style which does not look at an object's type to determine if it has the right interface; instead, the method or attribute is simply called or used. "If it looks like a duck and quacks like a duck, it must be a duck."

## EAFP
Easier to ask for forgiveness than permission. Common Python coding style using `try`/`except` statements. Contrasts with LBYL.

## expression
A piece of syntax which can be evaluated to some value.

## f-string
String literals prefixed with `f` or `F` for formatted string literals. See PEP 498.

## file object
An object exposing a file-oriented API (`read()`, `write()`). Three categories: raw binary files, buffered binary files, and text files.

## floor division
Mathematical division that rounds down. The operator is `//`. Example: `11 // 4` evaluates to `2`.

## free threading
A threading model where multiple threads can run Python bytecode simultaneously within the same interpreter. See PEP 703.

## function
A series of statements which returns some value to a caller. Can be passed zero or more arguments.

## function annotation
An annotation of a function parameter or return value, usually used for type hints:
```python
def sum_two_numbers(a: int, b: int) -> int:
   return a + b
```

## garbage collection
The process of freeing memory when it is not used anymore. Python uses reference counting and a cyclic garbage collector. Controlled via the `gc` module.

## generator
A function which returns a generator iterator. Contains `yield` expressions for producing a series of values.

## generator expression
An expression that returns an iterator: `sum(i*i for i in range(10))`.

## GIL (global interpreter lock)
The mechanism used by CPython to assure that only one thread executes Python bytecode at a time. As of Python 3.13, the GIL can be disabled using `--disable-gil` build configuration. See PEP 703.

## hashable
An object with a hash value that never changes during its lifetime (needs `__hash__()`) and can be compared to other objects (needs `__eq__()`). Most immutable built-in objects are hashable.

## IDLE
An Integrated Development and Learning Environment for Python that ships with the standard distribution.

## immutable
An object with a fixed value. Includes numbers, strings, and tuples. Cannot be altered; a new object must be created.

## import path
A list of locations searched by the path based finder for modules to import. Usually comes from `sys.path`.

## iterable
An object capable of returning its members one at a time. Examples: `list`, `str`, `tuple`, `dict`, file objects.

## iterator
An object representing a stream of data. Calls to `__next__()` return successive items. Raises `StopIteration` when exhausted.

## key function
A callable that returns a value used for sorting or ordering. Used with `sorted()`, `min()`, `max()`, `list.sort()`, etc.

## lambda
An anonymous inline function: `lambda [parameters]: expression`.

## LBYL
Look before you leap. Coding style that explicitly tests for pre-conditions. Contrasts with EAFP.

## list
A built-in Python sequence. Access to elements is O(1) (more like an array than a linked list).

## list comprehension
Compact way to process elements: `[x**2 for x in range(10) if x % 2 == 0]`.

## lock
A synchronization primitive that allows only one thread at a time to access a shared resource. Python provides `threading.Lock` and `threading.RLock`.

## mapping
A container supporting arbitrary key lookups. Examples: `dict`, `collections.defaultdict`, `collections.OrderedDict`.

## metaclass
The class of a class. Responsible for taking base classes and a class dictionary and creating the class.

## method
A function which is defined inside a class body. Called as an attribute of an instance, the method receives the instance as its first argument (conventionally called `self`).

## method resolution order (MRO)
The order in which base classes are searched during method resolution. Uses the C3 linearization algorithm.

## module
An object that serves as an organizational unit of Python code. Modules have a namespace containing arbitrary Python objects. Loaded by the import process.

## mutable
Mutable objects can change their value but keep their `id()`. Examples: lists, dictionaries.

## named tuple
A tuple subclass whose fields are accessible by name: `collections.namedtuple()` or `typing.NamedTuple`.

## namespace
The place where a variable is stored. Implemented as dictionaries. Examples: built-in names, global names in a module, local names in a function.

## nested scope
The ability to refer to a variable in an enclosing definition. Relevant for closures and `nonlocal` declarations.

## object
Any data with state (attributes or value) and defined behavior (methods). Also the ultimate base class of any new-style class.

## package
A Python module which can contain submodules or subpackages. Regular packages use `__init__.py` files.

## parameter
A named entity in a function definition that specifies an argument the function can accept. Five kinds: positional-or-keyword, positional-only, keyword-only, var-positional (`*args`), var-keyword (`**kwargs`).

## PEP
Python Enhancement Proposal. A design document providing information to the Python community or describing a new feature.

## property
An attribute managed by getter, setter, and deleter methods via the `@property` decorator.

## reference count
The number of references to an object. When the reference count drops to zero, the object is deallocated. Use `sys.getrefcount()` to check.

## sequence
An iterable which supports efficient element access using integer indices via `__getitem__()` and defines a `__len__()`. Examples: `str`, `list`, `tuple`, `bytes`.

## set comprehension
Compact way to create sets: `{x for x in range(10) if x % 2 == 0}`.

## single dispatch
A form of generic function dispatch where the implementation is chosen based on the type of a single argument. See `functools.singledispatch()`.

## slice
An object usually containing a portion of a sequence. Created using subscript notation with colons: `a[1:3]`, `a[::2]`.

## special method
A method that is called implicitly by Python to execute a certain operation. Surrounded by double underscores (e.g., `__init__`, `__str__`). Also called "magic methods" or "dunder methods".

## statement
A statement is part of a suite (a "block" of code). A statement is either an expression or one of several constructs with a keyword, such as `if`, `while`, or `for`.

## string
A sequence of Unicode characters. Python has no separate character type; a character is a string of size one.

## text file
A file object able to read and write `str` objects. Often the actual I/O involves bytes conversion with encoding.

## triple-quoted string
A string surrounded by three instances of either a quotation mark (`"""`) or an apostrophe (`'''`). Can span multiple lines.

## tuple
An immutable sequence type. Used for heterogeneous collections (like a C struct).

## type
The type of a Python object determines what kind of object it is. Every object has a type, accessible via `type(obj)`.

## type alias
A synonym for a type, created by assigning the type to an identifier or using the `type` statement (Python 3.12+).

## type hint
An annotation that specifies the expected type for a variable, class attribute, function parameter, or return value. Optional and not enforced at runtime.

## variable annotation
An annotation of a variable or class attribute: `count: int = 0`.

## virtual environment
A cooperatively isolated runtime environment. Each virtual environment has its own Python binary and independent set of installed packages. Created with `venv`.

## virtual machine
A computer defined entirely in software. Python's virtual machine executes the bytecode emitted by the bytecode compiler.

## Zen of Python
A listing of Python design principles and philosophies. Type `import this` at the interactive prompt.
