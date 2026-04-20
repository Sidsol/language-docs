---
sourceUrl: https://docs.python.org/3/library/enum.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

Added in version 3.4.

**Source code:** [Lib/enum.py](https://github.com/python/cpython/tree/3.14/Lib/enum.py)

* * *

An enumeration:
- is a set of symbolic names (members) bound to unique values
- can be iterated over to return its canonical (i.e. non-alias) members in definition order
- uses *call* syntax to return members by value
- uses *index* syntax to return members by name

## Basic Usage

```python
from enum import Enum

# class syntax
class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

# functional syntax
Color = Enum('Color', [('RED', 1), ('GREEN', 2), ('BLUE', 3)])
```

## Module Contents

### Enum Types

- **EnumType** - The metaclass for enum enumerations. (Formerly `EnumMeta`)
- **Enum** - Base class for creating enumerated constants.
- **IntEnum** - Base class for enums that are also subclasses of `int`.
- **StrEnum** - Base class for enums that are also subclasses of `str`. (Added 3.11)
- **Flag** - Base class for enums that can be combined using bitwise operations.
- **IntFlag** - Base class for flag enums that are also subclasses of `int`.
- **ReprEnum** - Used by `IntEnum`, `StrEnum`, and `IntFlag` to keep the `str()` of the mixed-in type. (Added 3.11)

### Utilities

- **auto** - Instances are replaced with an appropriate value for Enum members. `StrEnum` defaults to lower-cased member name; others default to 1 and increase.
- **unique()** - Enum class decorator that ensures only one name is bound to any one value.
- **verify()** - Enum class decorator that checks user-selectable constraints. (Added 3.11)
- **member()** - Make an object a member. Can be used as a decorator. (Added 3.11)
- **nonmember()** - Do not make an object a member. Can be used as a decorator. (Added 3.11)
- **global_enum()** - Modify str/repr to show members as belonging to the module.
- **show_flag_values()** - Return a list of all power-of-two integers contained in a flag.
- **property()** - Allows Enum members to have attributes without conflicting with member names.
- **EnumCheck** - Enum with values `CONTINUOUS`, `NAMED_FLAGS`, and `UNIQUE` for use with `verify()`. (Added 3.11)
- **FlagBoundary** - Enum with values `STRICT`, `CONFORM`, `EJECT`, and `KEEP`. (Added 3.11)

## class Enum

### Member Attributes

- **name** - The name used to define the Enum member.
- **value** - The value given to the Enum member.

```python
>>> Color.BLUE.name
'BLUE'
>>> Color.RED.value
1
```

### Metaclass Operations

```python
>>> Color['BLUE']           # Access by name
<Color.BLUE: 3>
>>> Color(3)                # Access by value
<Color.BLUE: 3>
>>> list(Color)             # Iterate
[<Color.RED: 1>, <Color.GREEN: 2>, <Color.BLUE: 3>]
>>> len(Color)              # Count members
3
>>> Color.RED in Color      # Membership test
True
```

### Special Methods

- **_generate_next_value_(name, start, count, last_values)** - Static method to determine the next value returned by `auto`.
- **_missing_(cls, value)** - Classmethod for looking up values not found.
- **__init__(self, *args, **kwds)** - By default does nothing.
- **__new__(cls, *args, **kwds)** - By default doesn't exist.
- **__repr__(self)** - Returns string for `repr()` calls.
- **__str__(self)** - Returns string for `str()` calls.
- **_add_alias_()** - Adds a new name as an alias to an existing member. (Added 3.13)
- **_add_value_alias_()** - Adds a new value as an alias to an existing member. (Added 3.13)

## class IntEnum

Members are also integers and can be used anywhere an integer can be used:

```python
from enum import IntEnum

class Number(IntEnum):
    ONE = 1
    TWO = 2
    THREE = 3

>>> Number.ONE + Number.TWO
3
>>> Number.THREE == 3
True
```

## class StrEnum (Added 3.11)

Members are also strings:

```python
from enum import StrEnum, auto

class Color(StrEnum):
    RED = 'r'
    GREEN = 'g'
    BLUE = 'b'
    UNKNOWN = auto()

>>> Color.UNKNOWN
<Color.UNKNOWN: 'unknown'>
```

Using `auto` with `StrEnum` results in lower-cased member name as the value.

## class Flag

Supports bitwise operations while keeping Flag membership:

```python
from enum import Flag, auto

class Perm(Flag):
    R = auto()
    W = auto()
    X = auto()

>>> Perm.R | Perm.W
<Perm.R|W: 3>
>>> Perm.R in (Perm.R | Perm.W)
True
```

## class IntFlag

Supports bitwise operations and is also an `int` subclass:

```python
from enum import IntFlag, auto

class Perm(IntFlag):
    R = auto()
    W = auto()
    X = auto()

>>> Perm.R | Perm.W
<Perm.R|W: 3>
>>> Perm.R + Perm.W
3
```

## Ensuring Unique Enumeration Values

```python
from enum import Enum, unique

@unique
class Mistake(Enum):
    ONE = 1
    TWO = 2
    THREE = 2  # raises ValueError

# verify() for additional constraints
from enum import verify, UNIQUE, CONTINUOUS

@verify(UNIQUE, CONTINUOUS)
class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
```

## Using auto

```python
from enum import Enum, auto

class Color(Enum):
    RED = auto()
    BLUE = auto()
    GREEN = auto()

>>> [member.value for member in Color]
[1, 2, 3]
```
