---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/lambda-expressions
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Lambda Expressions and Anonymous Functions

Use a lambda expression to create an anonymous function. Use the lambda declaration operator `=>` to separate the lambda's parameter list from its body.

## Expression Lambdas

A lambda with an expression on the right side of `=>`:

```csharp
(input-parameters) => expression
```

```csharp
Func<int, int> square = x => x * x;
Console.WriteLine(square(5));  // Output: 25
```

## Statement Lambdas

A lambda with a statement block as its body:

```csharp
(input-parameters) => { <sequence-of-statements> }
```

```csharp
Action<string> greet = name =>
{
    string greeting = $"Hello {name}!";
    Console.WriteLine(greeting);
};
greet("World");  // Output: Hello World!
```

## Input Parameters

```csharp
// Zero parameters
Action line = () => Console.WriteLine();

// One parameter (parentheses optional)
Func<double, double> cube = x => x * x * x;

// Two parameters
Func<int, int, bool> testForEquality = (x, y) => x == y;

// Explicitly typed
Func<int, string, bool> isTooLong = (int x, string s) => s.Length > x;

// Discards
Func<int, int, int> constant = (_, _) => 42;

// Default parameters (C# 12+)
var IncrementBy = (int source, int increment = 1) => source + increment;

// Params (C# 12+)
var sum = (params IEnumerable<int> values) => { /* ... */ };
```

## Async Lambdas

```csharp
button1.Click += async (sender, e) =>
{
    await ExampleMethodAsync();
    textBox1.Text += "\r\nControl returned to Click event handler.\n";
};
```

## Lambda Expressions and Tuples

```csharp
Func<(int, int, int), (int, int, int)> doubleThem =
    ns => (2 * ns.Item1, 2 * ns.Item2, 2 * ns.Item3);
var numbers = (2, 3, 4);
var doubledNumbers = doubleThem(numbers);
// Output: (4, 6, 8)
```

## Natural Type of a Lambda Expression

The compiler can infer the delegate type from a lambda expression:

```csharp
var parse = (string s) => int.Parse(s);  // Func<string, int>
```

## Explicit Return Type

```csharp
var choose = object (bool b) => b ? 1 : "two";  // Func<bool, object>
```

## Attributes

```csharp
Func<string?, int?> parse = [ProvidesNullCheck] (s) => (s is not null) ? int.Parse(s) : null;
var concat = ([DisallowNull] string a, [DisallowNull] string b) => a + b;
```

## Static Lambdas

Prevent capture of local variables or instance state:

```csharp
Func<double, double> square = static x => x * x;
```

## Variable Capture

Lambdas can capture outer variables. Captured variables aren't garbage collected until the delegate becomes eligible for collection.

Rules:
- Variables introduced within a lambda aren't visible in the enclosing method
- A lambda can't directly capture `in`, `ref`, or `out` parameters
- A `return` in a lambda doesn't cause the enclosing method to return
- A lambda can't contain `goto`, `break`, or `continue` targeting outside the lambda block
