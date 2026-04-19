---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/comparison-operators
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Comparison Operators (C# Reference)

The `<` (less than), `>` (greater than), `<=` (less than or equal), and `>=` (greater than or equal) comparison (relational) operators compare their operands. All integral and floating-point numeric types support these operators.

> **Note**: If any operand is `NaN` (`Double.NaN` or `Single.NaN`), the result is `false`.

The `char` type also supports comparison operators (character codes are compared). Enumeration types support comparison operators using underlying integral values.

## Less Than Operator `<`

```csharp
Console.WriteLine(7.0 < 5.1);   // output: False
Console.WriteLine(5.1 < 5.1);   // output: False
Console.WriteLine(0.0 < 5.1);   // output: True
```

## Greater Than Operator `>`

```csharp
Console.WriteLine(7.0 > 5.1);   // output: True
Console.WriteLine(5.1 > 5.1);   // output: False
Console.WriteLine(0.0 > 5.1);   // output: False
```

## Less Than or Equal Operator `<=`

```csharp
Console.WriteLine(7.0 <= 5.1);   // output: False
Console.WriteLine(5.1 <= 5.1);   // output: True
Console.WriteLine(0.0 <= 5.1);   // output: True
```

## Greater Than or Equal Operator `>=`

```csharp
Console.WriteLine(7.0 >= 5.1);   // output: True
Console.WriteLine(5.1 >= 5.1);   // output: True
Console.WriteLine(0.0 >= 5.1);   // output: False
```

## Operator Overloadability

You can overload `<`, `>`, `<=`, and `>=`. If you overload `<` or `>`, you must overload both. If you overload `<=` or `>=`, you must overload both.
