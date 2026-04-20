---
sourceUrl: https://docs.python.org/3/howto/enum.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: howto
---

An `Enum` is a set of symbolic names bound to unique values. They are similar to global variables, but they offer a more useful `repr()`, grouping, type-safety, and a few other features.

They are most useful when you have a variable that can take one of a limited selection of values. For example, the days of the week:

```python
from enum import Enum
class Weekday(Enum):
    MONDAY = 1
    TUESDAY = 2
    WEDNESDAY = 3
    THURSDAY = 4
    FRIDAY = 5
    SATURDAY = 6
    SUNDAY = 7
```

Or perhaps the RGB primary colors:

```python
from enum import Enum
class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
```

As you can see, creating an `Enum` is as simple as writing a class that inherits from `Enum` itself.

> **Note:** Case of Enum Members - We strongly recommend using UPPER_CASE names for members.

Depending on the nature of the enum a member's value may or may not be important, but either way that value can be used to get the corresponding member:

```python
>>> Weekday(3)
<Weekday.WEDNESDAY: 3>
```

Unlike many languages that treat enumerations solely as name/value pairs, Python Enums can have behavior added. For example, adding a classmethod:

```python
@classmethod
def from_date(cls, date):
    return cls(date.isoweekday())
```

### Flag

For combining several members into a single variable, use `Flag` with power-of-2 values:

```python
from enum import Flag
class Weekday(Flag):
    MONDAY = 1
    TUESDAY = 2
    WEDNESDAY = 4
    THURSDAY = 8
    FRIDAY = 16
    SATURDAY = 32
    SUNDAY = 64
```

`Flag` allows combining members:

```python
>>> weekend = Weekday.SATURDAY | Weekday.SUNDAY
>>> weekend
<Weekday.SATURDAY|SUNDAY: 96>
```

## Programmatic access to enumeration members and their attributes

```python
>>> Color(1)
<Color.RED: 1>
>>> Color['RED']
<Color.RED: 1>
>>> member = Color.RED
>>> member.name
'RED'
>>> member.value
1
```

## Duplicating enum members and values

Having two enum members with the same name is invalid. However, an enum member can have other names associated with it (aliases). Given two entries `A` and `B` with the same value (and `A` defined first), `B` is an alias for the member `A`.

## Ensuring unique enumeration values

Use the `@unique` decorator:

```python
from enum import Enum, unique
@unique
class Mistake(Enum):
    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 3  # raises ValueError
```

## Using automatic values

If the exact value is unimportant you can use `auto`:

```python
from enum import Enum, auto
class Color(Enum):
    RED = auto()
    BLUE = auto()
    GREEN = auto()
```

The values are chosen by `_generate_next_value_()`, which can be overridden.

## Iteration

Iterating over the members of an enum does not provide the aliases:

```python
>>> list(Shape)
[<Shape.SQUARE: 2>, <Shape.DIAMOND: 1>, <Shape.CIRCLE: 3>]
```

The special attribute `__members__` is a read-only ordered mapping of names to members, including aliases.

## Comparisons

Enumeration members are compared by identity. Ordered comparisons between enumeration values are not supported. Equality comparisons are defined though.

## Allowed members and attributes of enumerations

Enumerations are Python classes, and can have methods and special methods as usual:

```python
class Mood(Enum):
    FUNKY = 1
    HAPPY = 3

    def describe(self):
        return self.name, self.value

    def __str__(self):
        return 'my custom str! {0}'.format(self.value)

    @classmethod
    def favorite_mood(cls):
        return cls.HAPPY
```

## Restricted Enum subclassing

A new `Enum` class must have one base enum class, up to one concrete data type, and as many `object`-based mixin classes as needed. Subclassing an enumeration is allowed only if the enumeration does not define any members.

## Dataclass support

When inheriting from a `dataclass`, the `__repr__()` omits the inherited class' name:

```python
from dataclasses import dataclass, field

@dataclass
class CreatureDataMixin:
    size: str
    legs: int
    tail: bool = field(repr=False, default=True)

class Creature(CreatureDataMixin, Enum):
    BEETLE = 'small', 6
    DOG = 'medium', 4
```

## Pickling

Enumerations can be pickled and unpickled. Picklable enums must be defined in the top level of a module.

## Functional API

The `Enum` class is callable, providing a functional API:

```python
>>> Animal = Enum('Animal', 'ANT BEE CAT DOG')
>>> Animal
<enum 'Animal'>
>>> Animal.ANT
<Animal.ANT: 1>
>>> list(Animal)
[<Animal.ANT: 1>, <Animal.BEE: 2>, <Animal.CAT: 3>, <Animal.DOG: 4>]
```

## Derived Enumerations

### IntEnum

`IntEnum` members are also integers and can be used anywhere that an integer can be used.

### StrEnum

`StrEnum` members are also strings and can be used anywhere that a string can be used.

### IntFlag

`IntFlag` members are also integers and can be combined using the bitwise operators.

## How are Enums different?

Enums have a custom metaclass that affects many aspects of both derived `Enum` classes and their instances (members).

### Enum Members (Instances)

Enum members are instances of their enum class, and are normally accessed as `EnumClass.member`. In certain specific situations (such as writing custom enum behaviors), the `value` of enum members may be important, but normally it is not.

### Enum Classes

The `EnumType` metaclass is responsible for providing the `__contains__()`, `__dir__()`, `__iter__()` and other methods.
