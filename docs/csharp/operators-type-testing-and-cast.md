---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/type-testing-and-cast
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Type-Testing Operators and Cast Expressions

These operators and expressions perform type checking or type conversion:

- `is` — checks if the run-time type is compatible with a given type
- `as` — explicitly converts to a given type if compatible (returns `null` otherwise)
- `typeof` — obtains the `System.Type` instance for a type
- Cast expressions `(T)E` — explicit conversion to a target type

## The `is` Operator

Checks if the run-time type of an expression result is compatible with a given type:

```csharp
object b = new Base();
Console.WriteLine(b is Base);     // output: True
Console.WriteLine(b is Derived);  // output: False

object d = new Derived();
Console.WriteLine(d is Base);     // output: True
Console.WriteLine(d is Derived);  // output: True
```

The `is` operator doesn't consider user-defined conversions.

### Type Testing with Pattern Matching

```csharp
int i = 23;
object iBoxed = i;
int? jNullable = 7;
if (iBoxed is int a && jNullable is int b)
{
    Console.WriteLine(a + b);  // output: 30
}
```

## The `as` Operator

Explicitly converts an expression to a given reference or nullable value type. Returns `null` if conversion fails (never throws):

```csharp
IEnumerable<int> numbers = new List<int>(){ 10, 20, 30 };
IList<int> indexable = numbers as IList<int>;
if (indexable != null)
{
    Console.WriteLine(indexable[0] + indexable[indexable.Count - 1]);  // output: 40
}
```

`E as T` is equivalent to `E is T ? (T)(E) : (T)null` (but `E` is only evaluated once).

The `as` operator considers only reference, nullable, boxing, and unboxing conversions.

## Cast Expression

```csharp
double x = 1234.7;
int a = (int)x;
Console.WriteLine(a);   // output: 1234

IEnumerable<int> numbers = ints;
IList<int> list = (IList<int>)numbers;
```

If no explicit conversion exists, the compiler issues an error. At run time, an explicit conversion might fail and throw an exception.

## The `typeof` Operator

Gets the `System.Type` instance for a type:

```csharp
Console.WriteLine(typeof(List<string>));  // System.Collections.Generic.List`1[System.String]
Console.WriteLine(typeof(int));           // System.Int32
```

The argument must be a type name or type parameter. Can't be `dynamic` or `string?`.

### Type Testing with `typeof`

```csharp
object b = new Giraffe();
Console.WriteLine(b is Animal);                    // True (includes derived types)
Console.WriteLine(b.GetType() == typeof(Animal));  // False (exact type match)
Console.WriteLine(b.GetType() == typeof(Giraffe)); // True
```

## Operator Overloadability

You can't overload `is`, `as`, and `typeof`. A user-defined type can't overload `()`, but can define custom type conversions via `implicit` and `explicit` operators.
