---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/equality-operators
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Equality Operators (C# Reference)

The `==` (equality) and `!=` (inequality) operators check if their operands are equal or not.

## Equality Operator `==`

Returns `true` if its operands are equal, `false` otherwise.

### Value Types Equality

Operands of built-in value types are equal if their values are equal:

```csharp
int a = 1 + 2 + 3;
int b = 6;
Console.WriteLine(a == b);  // output: True

char c1 = 'a';
char c2 = 'A';
Console.WriteLine(c1 == c2);  // output: False
```

> **Note**: For `==`, `<`, `>`, `<=`, `>=`, if any operand is `NaN`, the result is `false`.

User-defined `struct` types don't support `==` by default — you must overload it.

### Reference Types Equality

By default, reference-type operands are equal if they refer to the same object:

```csharp
var a = new MyClass(1);
var b = new MyClass(1);
var c = a;
Console.WriteLine(a == b);  // output: False
Console.WriteLine(a == c);  // output: True
```

### Record Types Equality

Record types support `==` and `!=` with value equality semantics:

```csharp
public record Point(int X, int Y, string Name);
var p1 = new Point(2, 3, "A");
var p3 = new Point(2, 3, "A");
Console.WriteLine(p1 == p3);  // output: True
```

### String Equality

Two `string` operands are equal when both are `null` or both have the same length and identical characters:

```csharp
string s1 = "hello!";
string s2 = "HeLLo!";
Console.WriteLine(s1 == s2.ToLower());  // output: True
```

String equality comparisons are case-sensitive ordinal comparisons.

### Delegate Equality

Two delegate operands of the same run-time type are equal when both are `null` or their invocation lists have equal entries.

## Inequality Operator `!=`

Returns `true` if operands aren't equal. `x != y` produces the same result as `!(x == y)`.

```csharp
int a = 1 + 1 + 2 + 3;
int b = 6;
Console.WriteLine(a != b);  // output: True
```

## Operator Overloadability

You can overload `==` and `!=` — if you overload one, you must also overload the other. For record types, implement `IEquatable<T>.Equals` instead.
