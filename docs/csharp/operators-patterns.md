---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/patterns
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Pattern Matching

Use the `is` expression, the `switch` statement, and the `switch` expression to match an input expression against any number of characteristics. C# supports multiple patterns, including declaration, type, constant, relational, property, list, var, and discard. Combine patterns using `and`, `or`, and `not`.

## Declaration and Type Patterns

Check the run-time type of an expression and assign the result to a variable:

```csharp
object greeting = "Hello, World!";
if (greeting is string message)
{
    Console.WriteLine(message.ToLower());  // output: hello, world!
}
```

Type pattern (without variable):

```csharp
public static decimal CalculateToll(this Vehicle vehicle) => vehicle switch
{
    Car => 2.00m,
    Truck => 7.50m,
    null => throw new ArgumentNullException(nameof(vehicle)),
    _ => throw new ArgumentException("Unknown type"),
};
```

## Constant Pattern

Test if an expression result equals a specified constant:

```csharp
public static decimal GetGroupTicketPrice(int visitorCount) => visitorCount switch
{
    1 => 12.0m,
    2 => 20.0m,
    3 => 27.0m,
    4 => 32.0m,
    0 => 0.0m,
    _ => throw new ArgumentException("Not supported"),
};
```

Use for null checks (bypasses user-overloaded `==`):

```csharp
if (input is null) { return; }
if (input is not null) { /* ... */ }
```

## Relational Patterns

Compare an expression result with a constant using `<`, `>`, `<=`, or `>=`:

```csharp
static string Classify(double measurement) => measurement switch
{
    < -4.0 => "Too low",
    > 10.0 => "Too high",
    double.NaN => "Unknown",
    _ => "Acceptable",
};
```

## Logical Patterns

Combine patterns with `not`, `and`, `or`:

```csharp
// Negation
if (input is not null) { /* ... */ }

// Conjunction (range check)
static string Classify(double measurement) => measurement switch
{
    < -40.0 => "Too low",
    >= -40.0 and < 0 => "Low",
    >= 0 and < 10.0 => "Acceptable",
    >= 10.0 and < 20.0 => "High",
    >= 20.0 => "Too high",
    double.NaN => "Unknown",
};

// Disjunction
static string GetCalendarSeason(DateTime date) => date.Month switch
{
    3 or 4 or 5 => "spring",
    6 or 7 or 8 => "summer",
    9 or 10 or 11 => "autumn",
    12 or 1 or 2 => "winter",
    _ => throw new ArgumentOutOfRangeException(),
};
```

### Precedence

`not` binds first, then `and`, then `or`:

```csharp
// Correct: force and before not
static bool IsNotLowerCaseLetter(char c) => c is not (>= 'a' and <= 'z');

static bool IsLetter(char c) => c is (>= 'a' and <= 'z') or (>= 'A' and <= 'Z');
```

## Property Pattern

Match against an expression's properties or fields:

```csharp
static bool IsConferenceDay(DateTime date) =>
    date is { Year: 2020, Month: 5, Day: 19 or 20 or 21 };

// Extended property pattern (nested)
static bool IsAnyEndOnXAxis(Segment segment) =>
    segment is { Start.Y: 0 } or { End.Y: 0 };
```

## Positional Pattern

Deconstruct an expression and match resulting values:

```csharp
static string Classify(Point point) => point switch
{
    (0, 0) => "Origin",
    (1, 0) => "positive X basis end",
    (0, 1) => "positive Y basis end",
    _ => "Just a point",
};
```

With tuple patterns:

```csharp
static decimal GetDiscount(int groupSize, DateTime visitDate)
    => (groupSize, visitDate.DayOfWeek) switch
    {
        (<= 0, _) => throw new ArgumentException("Must be positive"),
        (_, DayOfWeek.Saturday or DayOfWeek.Sunday) => 0.0m,
        (>= 5 and < 10, DayOfWeek.Monday) => 20.0m,
        (>= 10, _) => 15.0m,
        _ => 0.0m,
    };
```

## `var` Pattern

Match any expression and assign to a new variable:

```csharp
static bool IsAcceptable(int id, int absLimit) =>
    SimulateDataFetch(id) is var results
    && results.Min() >= -absLimit
    && results.Max() <= absLimit;
```

## Discard Pattern

Match any expression using `_`:

```csharp
static decimal GetDiscountInPercent(DayOfWeek? dayOfWeek) => dayOfWeek switch
{
    DayOfWeek.Monday => 0.5m,
    DayOfWeek.Tuesday => 12.5m,
    _ => 0.0m,
};
```

## Parenthesized Pattern

```csharp
if (input is not (float or double)) { return; }
```

## List Patterns

Match arrays or lists against sequences:

```csharp
int[] numbers = { 1, 2, 3 };
Console.WriteLine(numbers is [1, 2, 3]);           // True
Console.WriteLine(numbers is [0 or 1, <= 2, >= 3]); // True

// Slice pattern
Console.WriteLine(new[] { 1, 2, 3, 4, 5 } is [> 0, > 0, ..]);  // True
Console.WriteLine(new[] { 1, 2, 3, 4 } is [>= 0, .., 2 or 4]); // True
```
