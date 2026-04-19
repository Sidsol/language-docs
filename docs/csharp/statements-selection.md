---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/selection-statements
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Selection Statements - `if`, `if-else`, and `switch`

The `if`, `if-else`, and `switch` statements select statements to execute based on the value of an expression.

## The `if` Statement

### With `else`

```csharp
if (tempInCelsius < 20.0)
{
    Console.WriteLine("Cold.");
}
else
{
    Console.WriteLine("Perfect!");
}
```

### Without `else`

```csharp
if (value < 0 || value > 100)
{
    Console.Write("Warning: not acceptable value! ");
}
Console.WriteLine($"The measurement value is {value}");
```

### Nested `if` Statements

```csharp
if (char.IsUpper(ch))
    Console.WriteLine($"An uppercase letter: {ch}");
else if (char.IsLower(ch))
    Console.WriteLine($"A lowercase letter: {ch}");
else if (char.IsDigit(ch))
    Console.WriteLine($"A digit: {ch}");
else
    Console.WriteLine($"Not alphanumeric character: {ch}");
```

In an expression context, use the conditional operator `?:` instead.

## The `switch` Statement

Selects a statement list to execute based on a pattern match:

```csharp
switch (measurement)
{
    case < 0.0:
        Console.WriteLine($"Measured value is {measurement}; too low.");
        break;

    case > 15.0:
        Console.WriteLine($"Measured value is {measurement}; too high.");
        break;

    case double.NaN:
        Console.WriteLine("Failed measurement.");
        break;

    default:
        Console.WriteLine($"Measured value is {measurement}.");
        break;
}
```

Supports relational patterns, constant patterns, and all other pattern types.

### Multiple Case Patterns

```csharp
switch (measurement)
{
    case < 0:
    case > 100:
        Console.WriteLine("Out of range.");
        break;
    default:
        Console.WriteLine($"Value is {measurement}.");
        break;
}
```

### Case Guards

Use `when` to add conditions to a case:

```csharp
switch ((a, b))
{
    case (> 0, > 0) when a == b:
        Console.WriteLine($"Both are valid and equal to {a}.");
        break;

    case (> 0, > 0):
        Console.WriteLine($"First is {a}, second is {b}.");
        break;

    default:
        Console.WriteLine("One or both are not valid.");
        break;
}
```

### Important Notes

- Control can't fall through from one switch section to the next
- Every switch section must end with `break`, `goto`, or `return`
- The `default` case can appear anywhere; it's evaluated only if no other case matches
- Use `switch` expression for value-returning scenarios
