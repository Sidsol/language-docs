---
sourceUrl: https://docs.python.org/3/faq/design.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: faq
---

# Design and History FAQ

## Why does Python use indentation for grouping of statements?

Guido van Rossum believes that using indentation for grouping is extremely elegant and contributes a lot to the clarity of the average Python program. Since there are no begin/end brackets there cannot be a disagreement between grouping perceived by the parser and the human reader.

## Why are floating-point calculations so inaccurate?

The `float` type in CPython uses a C `double` for storage. A `float` object's value is stored in binary floating-point with a fixed precision (typically 53 bits). Many numbers that can be written easily in decimal notation cannot be expressed exactly in binary floating point.

## Why are Python strings immutable?

Several advantages: performance (fixed storage requirements), and strings are considered as "elemental" as numbers - no activity can change the value.

## Why must 'self' be used explicitly in method definitions and calls?

The idea was borrowed from Modula-3. Benefits include:
- More obvious when using a method or instance attribute vs. a local variable
- No special syntax needed for calling methods from a particular class
- Solves syntactic problems with assignment to instance variables

## Why can't I use an assignment in an expression?

Starting in Python 3.8, you can! Assignment expressions use the walrus operator `:=`:

```python
while chunk := fp.read(200):
    print(chunk)
```

## Why does Python use methods for some functionality (e.g. list.index()) but functions for other (e.g. len(list))?

As Guido said: `len(x)` makes it clear the result is an integer and the argument is a container. With `x.len()`, you'd need to know x's type.

## Why is join() a string method instead of a list or tuple method?

`join()` is a string method because you're telling the separator string to iterate over a sequence of strings and insert itself between adjacent elements. It can be used with any iterable.

## How fast are exceptions?

A `try`/`except` block is extremely efficient if no exceptions are raised. Actually catching an exception is expensive.

## Why isn't there a switch or case statement in Python?

Since Python 3.10, `match ... case` statement provides pattern matching. Older alternatives include `if... elif... elif... else` chains and dictionary dispatch.

## Can't you emulate threads in the interpreter?

The interpreter pushes at least one C stack frame for each Python stack frame, so complete threads implementation requires thread support for C. Stackless Python has a redesigned interpreter loop that avoids the C stack.

## Why can't lambda expressions contain statements?

Python's syntactic framework can't handle statements nested inside expressions. Functions are already first class objects and can be declared in a local scope.

## Can Python be compiled to machine code, C or some other language?

Cython compiles modified Python with optional annotations into C extensions. Nuitka compiles Python into C++ code.

## How does Python manage memory?

CPython uses reference counting to detect inaccessible objects, and a cycle detection algorithm to collect reference cycles. The `gc` module provides functions to perform garbage collection and tune the collector.

## Why doesn't CPython use a more traditional garbage collection scheme?

Reference counting has advantages: easy to implement, portable, and predictable. The main disadvantage is inability to detect reference cycles, which is handled by a supplemental cycle detector.

## Why are there separate tuple and list data types?

Tuples are immutable and can be used as dictionary keys. Lists are mutable. Tuples represent heterogeneous records (like a C struct), while lists represent homogeneous sequences.

## How are lists implemented in CPython?

CPython's lists are variable-length arrays, not linked lists. The implementation uses a contiguous array of references to other objects. Over-allocation ensures amortized O(1) append.

## How are dictionaries implemented in CPython?

CPython's dictionaries are implemented as resizable hash tables. Compared to B-trees, this gives better performance for lookup in most cases.

## Why must dictionary keys be immutable?

Dictionary hash table implementation uses the hash value computed from the key. If the key were a mutable object, its value could change, and the hash lookup would break.

## Why doesn't list.sort() return the sorted list?

To avoid confusion about whether you're modifying the list or creating a new one. When you want a sorted copy, use `sorted()`.

## Why is there no goto?

You can use exceptions to provide a "structured goto." The `for` and `while` loops have `break` and `continue` statements.

## Why can't raw strings (r-strings) end with a backslash?

Raw strings were designed to ease creating input for processors that want to do their own backslash escape processing. The raw string notation `r"..."` still requires an even number of backslashes at the end.

## Why are colons required for the if/while/def/class statements?

The colon is required primarily to enhance readability (one of the results of the ABC language experimental results). It also makes it easier for editors with syntax highlighting.

## Why does Python allow commas at the end of lists and tuples?

Python lets you add a trailing comma at the end of lists, tuples, and dictionaries. This makes it easier to generate and modify such data structures programmatically, and the trailing comma avoids common errors in version control diffs.
