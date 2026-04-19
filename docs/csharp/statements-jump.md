---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/jump-statements
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Jump Statements - `break`, `continue`, `return`, and `goto`

Jump statements unconditionally transfer control.

## The `break` Statement

Terminates the closest enclosing iteration statement (`for`, `foreach`, `while`, `do`) or `switch` statement:

```csharp
int[] numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
foreach (int number in numbers)
{
    if (number == 3) { break; }
    Console.Write($"{number} ");
}
// Output: 0 1 2
```

In nested loops, `break` terminates only the innermost loop.

## The `continue` Statement

Starts a new iteration of the closest enclosing iteration statement:

```csharp
for (int i = 0; i < 5; i++)
{
    if (i < 3) { Console.WriteLine("skip"); continue; }
    Console.WriteLine("done");
}
// Output: skip, skip, skip, done, done
```

## The `return` Statement

Terminates execution of the function and returns control to the caller:

```csharp
double CalculateCylinderSurfaceArea(double baseRadius, double height)
{
    double baseArea = Math.PI * baseRadius * baseRadius;
    double sideArea = 2 * Math.PI * baseRadius * height;
    return 2 * baseArea + sideArea;
}
```

If the function doesn't compute a value, use `return;` without an expression.

### Ref Returns

Return a reference to a variable:

```csharp
ref int FindFirst(int[] numbers, Func<int, bool> predicate)
{
    for (int i = 0; i < numbers.Length; i++)
    {
        if (predicate(numbers[i]))
        {
            return ref numbers[i];
        }
    }
    throw new InvalidOperationException("No element found.");
}

int[] xs = new int[] { 10, 20, 30, 40 };
ref int found = ref FindFirst(xs, s => s == 30);
found = 0;
Console.WriteLine(string.Join(" ", xs));  // output: 10 20 0 40
```

Requirements for ref returns:
- The return value must have a lifetime beyond the method execution
- Can't be a local variable, `null` literal, constant, or enum member
- Not allowed on async methods

## The `goto` Statement

Transfers control to a labeled statement:

```csharp
foreach (var (key, matrix) in matrixLookup)
{
    for (int row = 0; row < matrix.Length; row++)
        for (int col = 0; col < matrix[row].Length; col++)
            if (matrix[row][col] == target)
                goto Found;

    Console.WriteLine($"Not found {target} in matrix {key}.");
    continue;
Found:
    Console.WriteLine($"Found {target} in matrix {key}.");
}
```

Use in `switch` statements with `goto case` or `goto default`:

```csharp
case CoffeeChoice.WithMilk:
    price += 5.0m;
    goto case CoffeeChoice.Plain;
```

> **Tip**: Consider refactoring deeply nested loops into separate methods instead of using `goto`.
