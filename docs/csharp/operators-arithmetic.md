---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/arithmetic-operators
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Arithmetic Operators (C# Reference)

The following operators perform arithmetic operations with operands of numeric types:

- Unary `++` (increment), `--` (decrement), `+` (plus), and `-` (minus) operators
- Binary `*` (multiplication), `/` (division), `%` (remainder), `+` (addition), and `-` (subtraction) operators

All integral and floating-point numeric types support these operators.

## Increment Operator `++`

The unary increment operator `++` increments its operand by 1.

### Postfix Increment

The result of `x++` is the value of `x` **before** the operation:

```csharp
int i = 3;
Console.WriteLine(i);   // output: 3
Console.WriteLine(i++); // output: 3
Console.WriteLine(i);   // output: 4
```

### Prefix Increment

The result of `++x` is the value of `x` **after** the operation:

```csharp
double a = 1.5;
Console.WriteLine(a);   // output: 1.5
Console.WriteLine(++a); // output: 2.5
Console.WriteLine(a);   // output: 2.5
```

## Decrement Operator `--`

The unary decrement operator `--` decrements its operand by 1. Supports both postfix (`x--`) and prefix (`--x`) forms, analogous to the increment operator.

## Unary Plus and Minus Operators

The unary `+` operator returns the value of its operand. The unary `-` operator computes the numeric negation of its operand.

```csharp
Console.WriteLine(+4);     // output: 4
Console.WriteLine(-4);     // output: -4
Console.WriteLine(-(-4));  // output: 4
```

The `ulong` type doesn't support the unary `-` operator.

## Multiplication Operator `*`

```csharp
Console.WriteLine(5 * 2);         // output: 10
Console.WriteLine(0.5 * 2.5);     // output: 1.25
Console.WriteLine(0.1m * 23.4m);  // output: 2.34
```

## Division Operator `/`

### Integer Division

The result is rounded toward zero:

```csharp
Console.WriteLine(13 / 5);    // output: 2
Console.WriteLine(-13 / 5);   // output: -2
```

### Floating-Point Division

```csharp
Console.WriteLine(16.8f / 4.1f);   // output: 4.097561
Console.WriteLine(16.8d / 4.1d);   // output: 4.09756097560976
Console.WriteLine(16.8m / 4.1m);   // output: 4.0975609756097560975609756098
```

## Remainder Operator `%`

Computes the remainder after dividing its left-hand operand by its right-hand operand.

```csharp
Console.WriteLine(5 % 4);   // output: 1
Console.WriteLine(5 % -4);  // output: 1
Console.WriteLine(-5 % 4);  // output: -1
Console.WriteLine(-5 % -4); // output: -1
```

## Addition Operator `+`

```csharp
Console.WriteLine(5 + 4);       // output: 9
Console.WriteLine(5 + 4.3);     // output: 9.3
Console.WriteLine(5.1m + 4.2m); // output: 9.3
```

## Subtraction Operator `-`

```csharp
Console.WriteLine(47 - 3);      // output: 44
Console.WriteLine(5 - 4.3);     // output: 0.7
Console.WriteLine(7.5m - 2.3m); // output: 5.2
```

## Compound Assignment

For a binary operator `op`, a compound assignment expression `x op= y` is equivalent to `x = x op y`, except that `x` is only evaluated once.

```csharp
int a = 5;
a += 9;   // a = 14
a -= 4;   // a = 10
a *= 2;   // a = 20
a /= 4;   // a = 5
a %= 3;   // a = 2
```

## Operator Precedence and Associativity

From highest to lowest:

1. **Primary**: postfix `x++` and `x--`
2. **Unary**: prefix `++x`, `--x`, unary `+` and `-`
3. **Multiplicative**: `*`, `/`, `%`
4. **Additive**: binary `+` and `-`

Binary arithmetic operators are left-associative.

## Arithmetic Overflow and Division by Zero

### Integer Arithmetic Overflow

- **Checked context**: Throws `OverflowException`
- **Unchecked context**: Result is truncated by discarding high-order bits

```csharp
int a = int.MaxValue;
int b = 3;
Console.WriteLine(unchecked(a + b));  // output: -2147483646

try { int d = checked(a + b); }
catch(OverflowException) { Console.WriteLine("Overflow!"); }
```

### Floating-Point Arithmetic Overflow

Operations with `float` and `double` never throw exceptions. Results can be `Infinity` or `NaN`:

```csharp
double a = 1.0 / 0.0;
Console.WriteLine(a);                    // output: Infinity
Console.WriteLine(double.IsInfinity(a)); // output: True

double b = 0.0 / 0.0;
Console.WriteLine(b);                // output: NaN
Console.WriteLine(double.IsNaN(b));  // output: True
```

## Operator Overloadability

You can overload the unary (`++`, `--`, `+`, `-`) and binary (`*`, `/`, `%`, `+`, `-`) arithmetic operators. Starting with C# 14, a user-defined type can explicitly overload compound assignment operators (`op=`).

### User-Defined Checked Operators

Use the `checked` keyword to define checked versions of arithmetic operators that throw `OverflowException` on overflow:

```csharp
public record struct Point(int X, int Y)
{
    public static Point operator checked +(Point left, Point right)
    {
        checked { return new Point(left.X + right.X, left.Y + right.Y); }
    }
    
    public static Point operator +(Point left, Point right)
    {
        return new Point(left.X + right.X, left.Y + right.Y);
    }
}
```
