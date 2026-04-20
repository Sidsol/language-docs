---
sourceUrl: https://docs.python.org/3/howto/sorting.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: howto
---

Author: Andrew Dalke and Raymond Hettinger

Python lists have a built-in `list.sort()` method that modifies the list in-place. There is also a `sorted()` built-in function that builds a new sorted list from an iterable.

In this document, we explore the various techniques for sorting data using Python.

## Sorting Basics

A simple ascending sort is very easy: just call the `sorted()` function. It returns a new sorted list:

```python
>>> sorted([5, 2, 3, 1, 4])
[1, 2, 3, 4, 5]
```

You can also use the `list.sort()` method. It modifies the list in-place (and returns `None` to avoid confusion). Usually it's less convenient than `sorted()` - but if you don't need the original list, it's slightly more efficient.

```python
>>> a = [5, 2, 3, 1, 4]
>>> a.sort()
>>> a
[1, 2, 3, 4, 5]
```

Another difference is that the `list.sort()` method is only defined for lists. In contrast, the `sorted()` function accepts any iterable.

## Key Functions

The `list.sort()` method and the functions `sorted()`, `min()`, `max()`, `heapq.nsmallest()`, and `heapq.nlargest()` have a *key* parameter to specify a function to be called on each list element prior to making comparisons.

```python
>>> sorted("This is a test string from Andrew".split(), key=str.casefold)
['a', 'Andrew', 'from', 'is', 'string', 'test', 'This']
```

A common pattern is to sort complex objects using some of the object's indices as keys:

```python
>>> student_tuples = [
...     ('john', 'A', 15),
...     ('jane', 'B', 12),
...     ('dave', 'B', 10),
... ]
>>> sorted(student_tuples, key=lambda student: student[2])   # sort by age
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```

## Operator Module Functions and Partial Function Evaluation

The `operator` module has `itemgetter()`, `attrgetter()`, and a `methodcaller()` function for common key function patterns:

```python
>>> from operator import itemgetter, attrgetter
>>> sorted(student_tuples, key=itemgetter(2))
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```

The operator module functions allow multiple levels of sorting:

```python
>>> sorted(student_tuples, key=itemgetter(1,2))
[('john', 'A', 15), ('dave', 'B', 10), ('jane', 'B', 12)]
```

The `functools.partial()` function can reduce the arity of a multi-argument function making it suitable for use as a key-function:

```python
>>> from functools import partial
>>> from unicodedata import normalize
>>> names = 'Zoë Åbjørn Núñez Élana Zeke Abe Nubia Eloise'.split()
>>> sorted(names, key=partial(normalize, 'NFD'))
['Abe', 'Åbjørn', 'Eloise', 'Élana', 'Nubia', 'Núñez', 'Zeke', 'Zoë']
```

## Ascending and Descending

Both `list.sort()` and `sorted()` accept a *reverse* parameter with a boolean value for descending sorts:

```python
>>> sorted(student_tuples, key=itemgetter(2), reverse=True)
[('john', 'A', 15), ('jane', 'B', 12), ('dave', 'B', 10)]
```

## Sort Stability and Complex Sorts

Sorts are guaranteed to be stable. That means that when multiple records have the same key, their original order is preserved.

```python
>>> data = [('red', 1), ('blue', 1), ('red', 2), ('blue', 2)]
>>> sorted(data, key=itemgetter(0))
[('blue', 1), ('blue', 2), ('red', 1), ('red', 2)]
```

This wonderful property lets you build complex sorts in a series of sorting steps. For example, to sort by descending grade and then ascending age, do the age sort first and then sort again using grade:

```python
>>> s = sorted(student_objects, key=attrgetter('age'))     # sort on secondary key
>>> sorted(s, key=attrgetter('grade'), reverse=True)       # now sort on primary key, descending
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```

The Timsort algorithm used in Python does multiple sorts efficiently because it can take advantage of any ordering already present in a dataset.

## Decorate-Sort-Undecorate

This idiom (also called Schwartzian transform) has three steps:
1. First, the initial list is decorated with new values that control the sort order.
2. Second, the decorated list is sorted.
3. Finally, the decorations are removed.

Now that Python sorting provides key-functions, this technique is not often needed.

## Comparison Functions

A comparison function computes the relative ordering for two inputs. Python provides `functools.cmp_to_key` to wrap comparison functions for use as key functions:

```python
sorted(words, key=cmp_to_key(strcoll))  # locale-aware sort order
```

## Strategies For Unorderable Types and Values

- Convert non-comparable input types to strings prior to sorting
- Remove special values (NaN, None) prior to sorting
- Convert mapping types into sorted item lists before sorting
- Convert set types into sorted lists before sorting

## Partial Sorts

The standard library provides several tools that do less work than a full sort:

- `min()` and `max()` return the smallest and largest values
- `heapq.nsmallest()` and `heapq.nlargest()` return the n smallest and largest values
- `heapq.heappush()` and `heapq.heappop()` create and maintain a partially sorted arrangement (priority queues)

## Odds and Ends

- For locale aware sorting, use `locale.strxfrm()` for a key function or `locale.strcoll()` for a comparison function
- The sort routines use `<` when making comparisons; add a `__lt__()` method for custom sort order
- Key functions need not depend directly on the objects being sorted; they can access external resources
