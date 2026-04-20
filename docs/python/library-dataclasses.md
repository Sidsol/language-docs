---
sourceUrl: https://docs.python.org/3/library/dataclasses.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

Added in version 3.7.

**Source code:** [Lib/dataclasses.py](https://github.com/python/cpython/tree/3.14/Lib/dataclasses.py)

* * *

This module provides a decorator and functions for automatically adding generated special methods such as `__init__()` and `__repr__()` to user-defined classes. It was originally described in PEP 557.

## Basic Usage

```python
from dataclasses import dataclass

@dataclass
class InventoryItem:
    """Class for keeping track of an item in inventory."""
    name: str
    unit_price: float
    quantity_on_hand: int = 0

    def total_cost(self) -> float:
        return self.unit_price * self.quantity_on_hand
```

This will automatically add an `__init__()` that looks like:

```python
def __init__(self, name: str, unit_price: float, quantity_on_hand: int = 0):
    self.name = name
    self.unit_price = unit_price
    self.quantity_on_hand = quantity_on_hand
```

## @dataclasses.dataclass Decorator

```python
@dataclasses.dataclass(*, init=True, repr=True, eq=True, order=False,
                       unsafe_hash=False, frozen=False, match_args=True,
                       kw_only=False, slots=False, weakref_slot=False)
```

Parameters:

- **init** (default `True`) - Generate `__init__()` method.
- **repr** (default `True`) - Generate `__repr__()` method.
- **eq** (default `True`) - Generate `__eq__()` method. Compares as a tuple of fields.
- **order** (default `False`) - Generate `__lt__()`, `__le__()`, `__gt__()`, and `__ge__()` methods.
- **unsafe_hash** (default `False`) - Force creation of `__hash__()` method even if it may not be safe.
- **frozen** (default `False`) - Assigning to fields generates an exception. Emulates read-only instances.
- **match_args** (default `True`) - Generate `__match_args__` tuple. (Added 3.10)
- **kw_only** (default `False`) - All fields will be marked as keyword-only. (Added 3.10)
- **slots** (default `False`) - Generate `__slots__` attribute. (Added 3.10)
- **weakref_slot** (default `False`) - Add `__weakref__` slot. (Added 3.11)

## dataclasses.field()

```python
dataclasses.field(*, default=MISSING, default_factory=MISSING, init=True,
                  repr=True, hash=None, compare=True, metadata=None,
                  kw_only=MISSING, doc=None)
```

Parameters:

- **default** - Default value for this field.
- **default_factory** - Zero-argument callable for default value (use for mutable defaults).
- **init** (default `True`) - Include as `__init__()` parameter.
- **repr** (default `True`) - Include in `__repr__()`.
- **hash** (default `None`) - Include in `__hash__()`. If `None`, uses the value of *compare*.
- **compare** (default `True`) - Include in comparison methods.
- **metadata** - A mapping for third-party extension mechanism.
- **kw_only** - Mark this field as keyword-only. (Added 3.10)
- **doc** - Optional docstring for this field. (Added 3.14)

```python
from dataclasses import dataclass, field

@dataclass
class C:
    mylist: list[int] = field(default_factory=list)

c = C()
c.mylist += [1, 2, 3]
```

## class dataclasses.Field

Field objects describe each defined field. Attributes: `name`, `type`, `default`, `default_factory`, `init`, `repr`, `hash`, `compare`, `metadata`, `kw_only`.

## Special Field Types

### dataclasses.InitVar

`InitVar[T]` type annotations describe init-only variables. These are not returned by `fields()` and are not set as attributes — they exist only as `__init__()` parameters and are passed to `__post_init__()`.

```python
@dataclass
class C:
    i: int
    j: int = None
    database: InitVar[DatabaseType] = None

    def __post_init__(self, database):
        if self.j is None and database is not None:
            self.j = database.lookup('j')
```

### dataclasses.KW_ONLY

A sentinel value used as a type annotation. Any fields after this are keyword-only. (Added 3.10)

```python
@dataclass
class Point:
    x: float
    _: KW_ONLY
    y: float
    z: float
```

## Module-Level Functions

- **dataclasses.fields(class_or_instance)** - Returns a tuple of `Field` objects for the dataclass. Does not return pseudo-fields (`ClassVar` or `InitVar`).

- **dataclasses.asdict(obj, *, dict_factory=dict)** - Converts the dataclass *obj* to a dict. Recursively converts nested dataclasses, dicts, lists, and tuples.

```python
@dataclass
class Point:
    x: int
    y: int

p = Point(10, 20)
assert asdict(p) == {'x': 10, 'y': 20}
```

- **dataclasses.astuple(obj, *, tuple_factory=tuple)** - Converts the dataclass *obj* to a tuple.

- **dataclasses.make_dataclass(cls_name, fields, *, bases=(), namespace=None, init=True, repr=True, eq=True, order=False, unsafe_hash=False, frozen=False, match_args=True, kw_only=False, slots=False, weakref_slot=False, module=None, decorator=dataclass)** - Creates a new dataclass dynamically.

```python
C = make_dataclass('C', [('x', int), 'y', ('z', int, field(default=5))], namespace={'add_one': lambda self: self.x + 1})
```

- **dataclasses.replace(obj, /, **changes)** - Creates a new object of the same type as *obj*, replacing fields with values from *changes*.

```python
@dataclass
class Point:
    x: int
    y: int

p = Point(1, 2)
p2 = replace(p, x=10)  # Point(x=10, y=2)
```

- **dataclasses.is_dataclass(obj)** - Returns `True` if its parameter is a dataclass or an instance of one.

## Post-Init Processing

```python
@dataclass
class C:
    a: float
    b: float
    c: float = field(init=False)

    def __post_init__(self):
        self.c = self.a + self.b
```

`__post_init__()` is called after `__init__()`. Init-only fields are passed as parameters to `__post_init__()`.

## Class Variables

Fields annotated with `ClassVar` are not considered dataclass fields and are ignored by the dataclass mechanisms.

## Frozen Instances

When `frozen=True`, instances are read-only:

```python
@dataclass(frozen=True)
class Point:
    x: int
    y: int

p = Point(1, 2)
p.x = 3  # raises FrozenInstanceError
```

## Inheritance

Dataclasses support inheritance. Field ordering follows MRO (Method Resolution Order):

```python
@dataclass
class Base:
    x: int
    y: int

@dataclass
class Child(Base):
    z: int = 0
    # __init__(self, x: int, y: int, z: int = 0)
```

## Slots

When `slots=True`, `__slots__` is generated for better memory efficiency and attribute access speed:

```python
@dataclass(slots=True)
class Point:
    x: int
    y: int
```
