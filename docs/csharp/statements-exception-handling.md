---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/exception-handling-statements
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Exception-Handling Statements

Use the `throw` and `try` statements to work with exceptions.

## The `throw` Statement

Throws an exception:

```csharp
if (shapeAmount <= 0)
{
    throw new ArgumentOutOfRangeException(nameof(shapeAmount), "Amount must be positive.");
}
```

Re-throw a caught exception (preserving stack trace):

```csharp
catch (Exception e)
{
    LogError(e, "Processing failed.");
    throw;  // preserves original stack trace
}
```

> **Note**: `throw;` preserves the original stack trace. `throw e;` updates `StackTrace`.

### The `throw` Expression

Use `throw` as an expression in:

```csharp
// Conditional operator
string first = args.Length >= 1 ? args[0] : throw new ArgumentException("Supply an argument.");

// Null-coalescing operator
name = value ?? throw new ArgumentNullException(nameof(value), "Name cannot be null");

// Expression-bodied member
DateTime ToDateTime(IFormatProvider provider) =>
    throw new InvalidCastException("Conversion not supported.");
```

## The `try` Statement

Three forms: `try-catch`, `try-finally`, and `try-catch-finally`.

### The `try-catch` Statement

```csharp
try
{
    var result = Process(-3, 4);
}
catch (ArgumentException e)
{
    Console.WriteLine($"Processing failed: {e.Message}");
}
catch (OperationCanceledException)
{
    Console.WriteLine("Processing is cancelled.");
}
```

- Only one `catch` block runs for any thrown exception
- Catch clauses are checked top to bottom
- A catch clause without a type matches any exception (must be last)

### Exception Filters (`when`)

```csharp
try
{
    var result = Process(-3, 4);
}
catch (Exception e) when (e is ArgumentException || e is DivideByZeroException)
{
    Console.WriteLine($"Processing failed: {e.Message}");
}
```

Advantages of exception filters:
- **Debugging**: Stack isn't unwound until a filter matches, preserving all local variables
- **Performance**: No stack unwinding overhead if no filter matches
- **Cleaner code**: Handle different conditions of the same exception type without nested if-else
- **Stack trace preservation**: Original stack trace is maintained

### The `try-finally` Statement

The `finally` block runs when control leaves the `try` block (normal execution, jump, or exception):

```csharp
public async Task HandleRequest(int itemId, CancellationToken ct)
{
    Busy = true;
    try
    {
        await ProcessAsync(itemId, ct);
    }
    finally
    {
        Busy = false;
    }
}
```

> **Tip**: When the resource type implements `IDisposable` or `IAsyncDisposable`, use the `using` statement instead.

### The `try-catch-finally` Statement

```csharp
try
{
    await ProcessAsync(itemId, ct);
}
catch (Exception e) when (e is not OperationCanceledException)
{
    LogError(e, $"Failed to process request for item ID {itemId}.");
    throw;
}
finally
{
    Busy = false;
}
```

### Exceptions in Async Methods

Exceptions in async functions propagate when you `await` the result:

```csharp
try
{
    int result = await processing;
}
catch (ArgumentException e)
{
    Console.WriteLine($"Processing failed: {e.Message}");
}
```
