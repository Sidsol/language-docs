---
sourceUrl: https://docs.python.org/3/howto/descriptor.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: howto
---

Author: Raymond Hettinger

Descriptors let objects customize attribute lookup, storage, and deletion.

This guide has four major sections:

1.  The "primer" gives a basic overview, moving gently from simple examples, adding one feature at a time. Start here if you're new to descriptors.
2.  The second section shows a complete, practical descriptor example. If you already know the basics, start there.
3.  The third section provides a more technical tutorial that goes into the detailed mechanics of how descriptors work. Most people don't need this level of detail.
4.  The last section has pure Python equivalents for built-in descriptors that are written in C.

## Primer

### Simple example: A descriptor that returns a constant

The `Ten` class is a descriptor whose `__get__()` method always returns the constant `10`:

```python
class Ten:
    def __get__(self, obj, objtype=None):
        return 10
```

To use the descriptor, it must be stored as a class variable in another class:

```python
class A:
    x = 5                       # Regular class attribute
    y = Ten()                   # Descriptor instance
```

### Dynamic lookups

Interesting descriptors typically run computations instead of returning constants:

```python
import os

class DirectorySize:
    def __get__(self, obj, objtype=None):
        return len(os.listdir(obj.dirname))

class Directory:
    size = DirectorySize()              # Descriptor instance
    def __init__(self, dirname):
        self.dirname = dirname          # Regular instance attribute
```

### Managed attributes

A popular use for descriptors is managing access to instance data. The descriptor is assigned to a public attribute in the class dictionary while the actual data is stored as a private attribute in the instance dictionary.

```python
import logging

logging.basicConfig(level=logging.INFO)

class LoggedAgeAccess:
    def __get__(self, obj, objtype=None):
        value = obj._age
        logging.info('Accessing %r giving %r', 'age', value)
        return value

    def __set__(self, obj, value):
        logging.info('Updating %r to %r', 'age', value)
        obj._age = value

class Person:
    age = LoggedAgeAccess()             # Descriptor instance
    def __init__(self, name, age):
        self.name = name                # Regular instance attribute
        self.age = age                  # Calls __set__()
    def birthday(self):
        self.age += 1                   # Calls both __get__() and __set__()
```

### Customized names

When a class uses descriptors, it can inform each descriptor about which variable name was used via `__set_name__()`:

```python
import logging

logging.basicConfig(level=logging.INFO)

class LoggedAccess:
    def __set_name__(self, owner, name):
        self.public_name = name
        self.private_name = '_' + name

    def __get__(self, obj, objtype=None):
        value = getattr(obj, self.private_name)
        logging.info('Accessing %r giving %r', self.public_name, value)
        return value

    def __set__(self, obj, value):
        logging.info('Updating %r to %r', self.public_name, value)
        setattr(obj, self.private_name, value)

class Person:
    name = LoggedAccess()                # First descriptor instance
    age = LoggedAccess()                 # Second descriptor instance
    def __init__(self, name, age):
        self.name = name                 # Calls the first descriptor
        self.age = age                   # Calls the second descriptor
    def birthday(self):
        self.age += 1
```

### Closing thoughts

A descriptor is what we call any object that defines `__get__()`, `__set__()`, or `__delete__()`. Optionally, descriptors can have a `__set_name__()` method.

Descriptors only work when used as class variables. When put in instances, they have no effect.

Descriptors are used throughout the language. It is how functions turn into bound methods. Common tools like `classmethod()`, `staticmethod()`, `property()`, and `functools.cached_property()` are all implemented as descriptors.

## Complete Practical Example

### Validator class

A validator is a descriptor for managed attribute access. Prior to storing any data, it verifies that the new value meets various type and range restrictions.

```python
from abc import ABC, abstractmethod

class Validator(ABC):
    def __set_name__(self, owner, name):
        self.private_name = '_' + name

    def __get__(self, obj, objtype=None):
        return getattr(obj, self.private_name)

    def __set__(self, obj, value):
        self.validate(value)
        setattr(obj, self.private_name, value)

    @abstractmethod
    def validate(self, value):
        pass
```

### Custom validators

```python
class OneOf(Validator):
    def __init__(self, *options):
        self.options = set(options)
    def validate(self, value):
        if value not in self.options:
            raise ValueError(f'Expected {value!r} to be one of {self.options!r}')

class Number(Validator):
    def __init__(self, minvalue=None, maxvalue=None):
        self.minvalue = minvalue
        self.maxvalue = maxvalue
    def validate(self, value):
        if not isinstance(value, (int, float)):
            raise TypeError(f'Expected {value!r} to be an int or float')
        if self.minvalue is not None and value < self.minvalue:
            raise ValueError(f'Expected {value!r} to be at least {self.minvalue!r}')
        if self.maxvalue is not None and value > self.maxvalue:
            raise ValueError(f'Expected {value!r} to be no more than {self.maxvalue!r}')

class String(Validator):
    def __init__(self, minsize=None, maxsize=None, predicate=None):
        self.minsize = minsize
        self.maxsize = maxsize
        self.predicate = predicate
    def validate(self, value):
        if not isinstance(value, str):
            raise TypeError(f'Expected {value!r} to be a str')
        if self.minsize is not None and len(value) < self.minsize:
            raise ValueError(f'Expected {value!r} to be no smaller than {self.minsize!r}')
        if self.maxsize is not None and len(value) > self.maxsize:
            raise ValueError(f'Expected {value!r} to be no bigger than {self.maxsize!r}')
        if self.predicate is not None and not self.predicate(value):
            raise ValueError(f'Expected {self.predicate} to be true for {value!r}')
```

### Practical application

```python
class Component:
    name = String(minsize=3, maxsize=10, predicate=str.isupper)
    kind = OneOf('wood', 'metal', 'plastic')
    quantity = Number(minvalue=0)

    def __init__(self, name, kind, quantity):
        self.name = name
        self.kind = kind
        self.quantity = quantity
```

## Technical Tutorial

### Definition and introduction

In general, a descriptor is an attribute value that has one of the methods in the descriptor protocol. Those methods are `__get__()`, `__set__()`, and `__delete__()`. If any of those methods are defined for an attribute, it is said to be a descriptor.

The default behavior for attribute access is to get, set, or delete the attribute from an object's dictionary. For instance, `a.x` has a lookup chain starting with `a.__dict__['x']`, then `type(a).__dict__['x']`, and continuing through the method resolution order of `type(a)`. If the looked-up value is an object defining one of the descriptor methods, then Python may override the default behavior and invoke the descriptor method instead.

### Descriptor protocol

```
descr.__get__(self, obj, type=None) -> value
descr.__set__(self, obj, value) -> None
descr.__delete__(self, obj) -> None
```

If an object defines `__set__()` or `__delete__()`, it is considered a data descriptor. Descriptors that only define `__get__()` are called non-data descriptors.

Data and non-data descriptors differ in how overrides are calculated with respect to entries in an instance's dictionary. If an instance's dictionary has an entry with the same name as a data descriptor, the data descriptor takes priority. If an instance's dictionary has an entry with the same name as a non-data descriptor, the dictionary entry takes priority.

## Pure Python Equivalents

### Properties

```python
class Property:
    def __init__(self, fget=None, fset=None, fdel=None, doc=None):
        self.fget = fget
        self.fset = fset
        self.fdel = fdel
        if doc is None and fget is not None:
            doc = fget.__doc__
        self.__doc__ = doc

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        if self.fget is None:
            raise AttributeError("unreadable attribute")
        return self.fget(obj)

    def __set__(self, obj, value):
        if self.fset is None:
            raise AttributeError("can't set attribute")
        self.fset(obj, value)

    def __delete__(self, obj):
        if self.fdel is None:
            raise AttributeError("can't delete attribute")
        self.fdel(obj)

    def getter(self, fget):
        return type(self)(fget, self.fset, self.fdel, self.__doc__)

    def setter(self, fset):
        return type(self)(self.fget, fset, self.fdel, self.__doc__)

    def deleter(self, fdel):
        return type(self)(self.fget, self.fset, fdel, self.__doc__)
```

### Functions and methods

Functions stored in class dictionaries get turned into methods when invoked. Methods only differ from regular functions in that the object instance is prepended to the other arguments. By convention, the instance is called `self` but could be called anything.

### Static methods

Static methods return the underlying function without changes. A good use of static methods is to group related utility functions.

### Class methods

Unlike static methods, class methods prepend the class reference to the argument list before calling the function.
