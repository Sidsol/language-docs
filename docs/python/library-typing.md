---
sourceUrl: https://docs.python.org/3/library/typing.html
fetchedAt: "2026-04-19T23:59:00Z"
language: python
section: library
---

Added in version 3.5.

**Source code:** [Lib/typing.py](https://github.com/python/cpython/tree/3.14/Lib/typing.py)

* * *

This module provides runtime support for type hints.

Note: The Python runtime does not enforce function and variable type annotations. They can be used by third party tools such as type checkers, IDEs, linters, etc.

## Basic Usage

```python
def surface_area_of_cube(edge_length: float) -> str:
    return f"The surface area of the cube is {6 * edge_length ** 2}."
```

While type hints can be simple classes like `float` or `str`, they can also be more complex. The `typing` module provides a vocabulary of more advanced type hints.

## Type Aliases

A type alias is defined using the `type` statement (Python 3.12+), which creates an instance of `TypeAliasType`:

```python
type Vector = list[float]

def scale(scalar: float, vector: Vector) -> Vector:
    return [scalar * num for num in vector]
```

For backwards compatibility, type aliases can also be created through simple assignment or with `TypeAlias`:

```python
from typing import TypeAlias
Vector: TypeAlias = list[float]
```

## NewType

Use `NewType` to create distinct types:

```python
from typing import NewType

UserId = NewType('UserId', int)
some_id = UserId(524313)

def get_user_name(user_id: UserId) -> str:
    ...

user_a = get_user_name(UserId(42351))  # passes type checking
user_b = get_user_name(-1)              # fails type checking
```

## Annotating Callable Objects

```python
from collections.abc import Callable, Awaitable

def feeder(get_next_item: Callable[[], str]) -> None: ...
def async_query(on_success: Callable[[int], None],
                on_error: Callable[[int, Exception], None]) -> None: ...

# Callable with any parameter list
x: Callable[..., str]
```

For complex signatures, use `Protocol` with a `__call__()` method.

## Generics

```python
from collections.abc import Sequence

def first[T](l: Sequence[T]) -> T:  # Python 3.12+ syntax
    return l[0]

# Or using TypeVar:
from typing import TypeVar
U = TypeVar('U')
def second(l: Sequence[U]) -> U:
    return l[1]
```

## Annotating Tuples

```python
x: tuple[int] = (5,)                # length 1, element is int
y: tuple[int, str] = (5, "foo")     # length 2
z: tuple[int, ...] = (1, 2, 3)     # variable length, all ints
empty: tuple[()] = ()                # empty tuple
```

## The Type of Class Objects

```python
a = 3         # Has type int
b = int       # Has type type[int]
c = type(a)   # Also has type type[int]
```

## Annotating Generators and Coroutines

```python
from collections.abc import Generator, Iterator, AsyncGenerator

def echo_round() -> Generator[int, float, str]:
    sent = yield 0
    while sent >= 0:
        sent = yield round(sent)
    return 'Done'

def infinite_stream(start: int) -> Iterator[int]:
    while True:
        yield start
        start += 1
```

## User-Defined Generic Types

```python
from logging import Logger

class LoggedVar[T]:
    def __init__(self, value: T, name: str, logger: Logger) -> None:
        self.name = name
        self.logger = logger
        self.value = value

    def set(self, new: T) -> None:
        self.log('Set ' + repr(self.value))
        self.value = new

    def get(self) -> T:
        self.log('Get ' + repr(self.value))
        return self.value
```

## Special Forms

### Union Types

```python
# Python 3.10+ syntax
def process(x: int | str) -> None: ...

# Older syntax
from typing import Union
def process(x: Union[int, str]) -> None: ...
```

### Optional

```python
from typing import Optional
# Optional[X] is equivalent to X | None
def foo(x: Optional[int] = None) -> None: ...
```

### Any

`Any` is compatible with every type. A value of type `Any` is dynamically typed.

### Literal

```python
from typing import Literal

def validate_simple(data: Literal['yes', 'no']) -> bool: ...
```

### Final

```python
from typing import Final

MAX_SIZE: Final = 9000
MAX_SIZE += 1  # Error reported by type checker
```

### ClassVar

```python
from typing import ClassVar

class Starship:
    stats: ClassVar[dict[str, int]] = {}
    damage: int = 10
```

### TypeGuard and TypeIs

```python
from typing import TypeGuard, TypeIs

def is_str_list(val: list[object]) -> TypeGuard[list[str]]:
    return all(isinstance(x, str) for x in val)

def is_str(val: object) -> TypeIs[str]:
    return isinstance(val, str)
```

## Key Classes and Helpers

### TypeVar

```python
T = TypeVar('T')                    # Can be anything
S = TypeVar('S', bound=str)         # Can be any subtype of str
A = TypeVar('A', str, bytes)        # Must be exactly str or bytes
```

### ParamSpec

```python
from typing import ParamSpec, Callable
P = ParamSpec('P')

def decorator(func: Callable[P, int]) -> Callable[P, str]:
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> str:
        return str(func(*args, **kwargs))
    return wrapper
```

### TypeVarTuple

```python
from typing import TypeVarTuple, Unpack
Ts = TypeVarTuple('Ts')

def move_first_element_to_last(tup: tuple[int, *Ts]) -> tuple[*Ts, int]: ...
```

### Protocol

```python
from typing import Protocol

class SupportsClose(Protocol):
    def close(self) -> None: ...

def close_resource(resource: SupportsClose) -> None:
    resource.close()
```

### TypedDict

```python
from typing import TypedDict

class Point2D(TypedDict):
    x: int
    y: int
    label: str

a: Point2D = {'x': 1, 'y': 2, 'label': 'good'}
```

### NamedTuple

```python
from typing import NamedTuple

class Employee(NamedTuple):
    name: str
    id: int = 3

employee = Employee('Guido', 2)
```

### dataclass_transform

Decorator to mark a class, metaclass, or function as providing dataclass-like behavior.

### overload

```python
from typing import overload

@overload
def process(x: int) -> int: ...
@overload
def process(x: str) -> str: ...

def process(x: int | str) -> int | str:
    return x
```

### runtime_checkable

Decorator for Protocol classes that allows `isinstance()` checks.

### Annotated

```python
from typing import Annotated

def speed(distance: Annotated[float, "meters"],
          time: Annotated[float, "seconds"]) -> float:
    return distance / time
```

### TYPE_CHECKING

A special constant that is `True` when type checkers are running, but `False` at runtime. Useful for imports only needed for type annotations:

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from expensive_module import ExpensiveClass
```

## Deprecated Aliases

As of Python 3.9+, you can use standard collection types (`list`, `dict`, `tuple`, `set`, etc.) directly in type annotations instead of their `typing` counterparts (`List`, `Dict`, `Tuple`, `Set`, etc.). The `typing` aliases are deprecated.
