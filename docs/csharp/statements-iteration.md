---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/iteration-statements
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Iteration Statements - `for`, `foreach`, `do`, and `while`

Use iteration statements to repeatedly execute a statement or block of statements.

## The `for` Statement

Executes its body while a specified Boolean expression evaluates to `true`:

```csharp
for (int i = 0; i < 3; i++)
{
    Console.Write(i);
}
// Output: 012
```

Elements of the `for` statement:
- **Initializer**: runs once before the loop (e.g., `int i = 0`)
- **Condition**: Boolean expression checked before each iteration (e.g., `i < 3`)
- **Iterator**: runs after each iteration (e.g., `i++`)
- **Body**: statement or block

All sections are optional. `for ( ; ; )` creates an infinite loop.

## The `foreach` Statement

Enumerates elements of a collection:

```csharp
List<int> fibNumbers = new() { 0, 1, 1, 2, 3, 5, 8, 13 };
foreach (int element in fibNumbers)
{
    Console.Write($"{element} ");
}
// Output: 0 1 1 2 3 5 8 13
```

Works with any type implementing `IEnumerable` or `IEnumerable<T>`, or having a `GetEnumerator` method.

### Ref Iteration

```csharp
Span<int> storage = stackalloc int[10];
int num = 0;
foreach (ref int item in storage)
{
    item = num++;
}
```

### `await foreach`

For asynchronous streams implementing `IAsyncEnumerable<T>`:

```csharp
await foreach (var item in GenerateSequenceAsync())
{
    Console.WriteLine(item);
}
```

### Type Inference

Use `var` to let the compiler infer the iteration variable type:

```csharp
foreach (var item in collection) { }
```

## The `do` Statement

Executes its body one or more times (evaluates condition **after** each execution):

```csharp
int n = 0;
do
{
    Console.Write(n);
    n++;
} while (n < 5);
// Output: 01234
```

## The `while` Statement

Executes its body zero or more times (evaluates condition **before** each execution):

```csharp
int n = 0;
while (n < 5)
{
    Console.Write(n);
    n++;
}
// Output: 01234
```

## Loop Control

- Use `break` to exit the loop
- Use `continue` to skip to the next iteration
