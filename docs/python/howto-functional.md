---
sourceUrl: https://docs.python.org/3/howto/functional.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: howto
---

Author: A. M. Kuchling

Release: 0.32

In this document, we'll take a tour of Python's features suitable for implementing programs in a functional style. After an introduction to the concepts of functional programming, we'll look at language features such as iterators and generators and relevant library modules such as `itertools` and `functools`.

## Introduction

Programming languages support decomposing problems in several different ways:

*   Most programming languages are **procedural**: programs are lists of instructions that tell the computer what to do with the program's input.
*   In **declarative** languages, you write a specification that describes the problem to be solved, and the language implementation figures out how to perform the computation efficiently.
*   **Object-oriented** programs manipulate collections of objects. Objects have internal state and support methods that query or modify this internal state in some way.
*   **Functional** programming decomposes a problem into a set of functions. Ideally, functions only take inputs and produce outputs, and don't have any internal state that affects the output produced for a given input.

Python programs written in functional style usually won't go to the extreme of avoiding all I/O or all assignments; instead, they'll provide a functional-appearing interface but will use non-functional features internally.

### Formal provability

A theoretical benefit is that it's easier to construct a mathematical proof that a functional program is correct.

### Modularity

A more practical benefit of functional programming is that it forces you to break apart your problem into small pieces. Programs are more modular as a result.

### Ease of debugging and testing

Testing and debugging a functional-style program is easier. Debugging is simplified because functions are generally small and clearly specified. Testing is easier because each function is a potential subject for a unit test.

### Composability

As you work on a functional-style program, you'll write a number of functions with varying inputs and outputs. Over time you'll form a personal library of utilities.

## Iterators

An iterator is an object representing a stream of data; this object returns the data one element at a time. A Python iterator must support a method called `__next__()` that takes no arguments and always returns the next element of the stream. If there are no more elements in the stream, `__next__()` must raise the `StopIteration` exception.

The built-in `iter()` function takes an arbitrary object and tries to return an iterator that will return the object's contents or elements, raising `TypeError` if the object doesn't support iteration.

```python
>>> L = [1, 2, 3]
>>> it = iter(L)
>>> next(it)
1
>>> next(it)
2
>>> next(it)
3
>>> next(it)
Traceback (most recent call last):
  ...
StopIteration
```

Python expects iterable objects in several different contexts, the most important being the `for` statement.

### Data Types That Support Iterators

Any Python sequence type, such as strings, will automatically support creation of an iterator. Calling `iter()` on a dictionary returns an iterator that will loop over the dictionary's keys.

Starting with Python 3.7, dictionary iteration order is guaranteed to be the same as the insertion order.

## Generator expressions and list comprehensions

Two common operations on an iterator's output are: 1) performing some operation for every element, 2) selecting a subset of elements that meet some condition.

```python
>>> line_list = ['  line 1\n', 'line 2  \n', ' \n', '']
>>> # Generator expression -- returns iterator
>>> stripped_iter = (line.strip() for line in line_list)
>>> # List comprehension -- returns list
>>> stripped_list = [line.strip() for line in line_list]
```

You can select only certain elements by adding an `"if"` condition:

```python
>>> stripped_list = [line.strip() for line in line_list if line != ""]
```

## Generators

Generators are a special class of functions that simplify the task of writing iterators. Regular functions compute a value and return it, but generators return an iterator that returns a stream of values.

```python
def generate_ints(N):
    for i in range(N):
        yield i
```

Any function containing a `yield` keyword is a generator function; this is detected by Python's bytecode compiler which compiles the function specially as a result.

When you call a generator function, it doesn't return a single value; instead it returns a generator object that supports the iterator protocol.

### Passing values into a generator

Values are sent into a generator by calling its `send(value)` method. This value then becomes the value of the current `yield` expression, and the generator resumes execution.

## Built-in functions

### map() and filter()

`map(f, iterA, iterB, ...)` returns an iterator over the sequence `f(iterA[0], iterB[0]), f(iterA[1], iterB[1]), ...`.

`filter(predicate, iter)` returns an iterator over all the sequence elements that meet a certain condition.

### enumerate()

`enumerate(iter, start=0)` counts off the elements in the iterable returning 2-tuples containing the count (from start) and each element.

### sorted()

`sorted(iterable, key=None, reverse=False)` collects all the elements of the iterable into a list, sorts the list, and returns the sorted result.

### any() and all()

`any(iter)` returns `True` if any element is a true value. `all(iter)` returns `True` if all of the elements are true values.

### zip()

`zip(iterA, iterB, ...)` takes one element from each iterable and returns them in a tuple. It doesn't construct an in-memory list and exhaust all the input iterators before returning.

## The itertools module

The `itertools` module contains a number of commonly-used iterators as well as functions for combining several iterators.

### Creating new iterators

- `itertools.count(start, step)` returns an infinite stream of evenly spaced values.
- `itertools.cycle(iter)` saves a copy of the contents of a provided iterable and returns a new iterator that returns its elements from first to last, then restarts.
- `itertools.repeat(elem, [n])` returns the provided element n times, or returns the element endlessly if n is not provided.
- `itertools.chain(iterA, iterB, ...)` takes an arbitrary number of iterables as input, and returns all their elements.
- `itertools.islice(iter, [start], stop, [step])` returns a stream that's a slice of the iterator.

### Calling functions on elements

- `itertools.starmap(func, iter)` assumes that the iterable will return a stream of tuples, and calls `func` using these tuples as the arguments.

### Selecting elements

- `itertools.filterfalse(predicate, iter)` is the opposite of `filter()`.
- `itertools.takewhile(predicate, iter)` returns elements for as long as the predicate returns true.
- `itertools.dropwhile(predicate, iter)` discards elements while the predicate returns true, and then returns the rest.
- `itertools.compress(data, selectors)` takes two iterators and returns only those data elements corresponding to true selectors.

### Combinatoric functions

- `itertools.combinations(iterable, r)` returns an iterator giving all possible r-tuple combinations.
- `itertools.permutations(iterable, r=None)` returns all possible orderings.
- `itertools.product(iterA, iterB, ...)` returns the Cartesian product.

### Grouping elements

- `itertools.groupby(iter, key_func=None)` collects all the consecutive elements from the underlying iterable that have the same key value.

## The functools module

The `functools` module contains some higher-order functions.

### functools.reduce()

`functools.reduce(func, iter, [initial_value])` cumulatively performs an operation on all the iterable's elements and, therefore, can't be applied to infinite iterables.

### functools.partial()

`functools.partial(func, arg1, arg2, ..., kwarg1=value1)` creates a new function that acts like `func` but has some arguments pre-filled.

## The operator module

The `operator` module provides functions corresponding to Python's operators. Some examples: `operator.add(a, b)`, `operator.ne(a, b)`, `operator.attrgetter('id')`.

## Small functions and the lambda expression

When writing functional-style programs, you'll often need little functions that act as predicates or that combine elements in some way.

```python
adder = lambda x, y: x + y
print_assign = lambda name, value: name + '=' + str(value)
```

An alternative is to use `def` statements and give the functions meaningful names.
