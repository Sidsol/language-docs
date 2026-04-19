---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# C# Operators and Expressions

C# provides many operators. The built-in types support many of these operators, so you can perform basic operations with values of those types.

## Operator Groups

- **[Arithmetic operators](operators-arithmetic.md)** — perform arithmetic operations with numeric operands
- **[Comparison operators](operators-comparison.md)** — compare numeric operands
- **[Boolean logical operators](operators-boolean-logical.md)** — perform logical operations with `bool` operands
- **[Bitwise and shift operators](operators-bitwise-and-shift.md)** — perform bitwise or shift operations with operands of the integral types
- **[Equality operators](operators-equality.md)** — check if their operands are equal or not
- **[Lambda expressions](operators-lambda-expressions.md)** — create anonymous functions
- **[Pattern matching](operators-patterns.md)** — `is`, `switch`, `and`, `or`, `not` patterns
- **[Type testing and cast](operators-type-testing-and-cast.md)** — `is`, `as`, `typeof`, and cast expressions

You can typically **overload** these operators. By overloading an operator, you specify the operator behavior for the operands of a user-defined type.

## Expressions

The simplest C# expressions are literals (for example, integer and real numbers) and names of variables. You can combine them into complex expressions by using operators.

```csharp
int a, b, c;
a = 7;
b = a;
c = b++;
b = a + b * c;
c = a >= 100 ? b : c / 10;
a = (int)Math.Sqrt(b * b + c * c);

string s = "String literal";
char l = s[s.Length - 1];

List<int> numbers = [..collection];
b = numbers.FindLast(n => n > 1);
```

### Interpolated String Expressions

```csharp
var r = 2.3;
var message = $"The area of a circle with radius {r} is {Math.PI * r * r:F3}.";
// Output: The area of a circle with radius 2.3 is 16.619.
```

### Query Expressions

```csharp
int[] scores = { 90, 97, 78, 68, 85 };
IEnumerable<int> highScoresQuery =
    from score in scores
    where score > 80
    orderby score descending
    select score;
// Output: 97 90 85
```

## Operator Precedence

From highest to lowest precedence:

| Operators | Category |
|---|---|
| `x.y`, `f(x)`, `a[i]`, `x?.y`, `x?[y]`, `x++`, `x--`, `x!`, `new`, `typeof`, `checked`, `unchecked`, `default`, `nameof`, `delegate`, `sizeof`, `stackalloc`, `x->y` | Primary |
| `+x`, `-x`, `!x`, `~x`, `++x`, `--x`, `^x`, `(T)x`, `await`, `&x`, `*x`, `true` and `false` | Unary |
| `x..y` | Range |
| `switch`, `with` | switch and with expressions |
| `x * y`, `x / y`, `x % y` | Multiplicative |
| `x + y`, `x – y` | Additive |
| `x << y`, `x >> y`, `x >>> y` | Shift |
| `x < y`, `x > y`, `x <= y`, `x >= y`, `is`, `as` | Relational and type-testing |
| `x == y`, `x != y` | Equality |
| `x & y` | Boolean logical AND or bitwise logical AND |
| `x ^ y` | Boolean logical XOR or bitwise logical XOR |
| `x \| y` | Boolean logical OR or bitwise logical OR |
| `x && y` | Conditional AND |
| `x \|\| y` | Conditional OR |
| `x ?? y` | Null-coalescing operator |
| `c ? t : f` | Conditional operator |
| `x = y`, `x += y`, `x -= y`, `=>` | Assignment and lambda declaration |

## Operator Associativity

- **Left-associative** operators are evaluated from left to right. Most binary operators are left-associative.
- **Right-associative** operators are evaluated from right to left. Assignment operators, null-coalescing operators, lambdas, and the conditional operator `?:` are right-associative.

```csharp
int a = 13 / 5 / 2;     // (13 / 5) / 2 = 1
int b = 13 / (5 / 2);   // 13 / 2 = 6
```

## Operand Evaluation

Operands in an expression are evaluated from left to right:

| Expression | Order of evaluation |
|---|---|
| `a + b` | a, b, + |
| `a + b * c` | a, b, c, *, + |
| `a / b + c * d` | a, b, /, c, d, *, + |
| `a / (b + c) * d` | a, b, c, +, /, d, * |

Some operators evaluate operands conditionally: `&&`, `||`, `??`, `??=`, `?.`, `?[]`, and `?:`.
