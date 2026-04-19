---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/bitwise-and-shift-operators
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Bitwise and Shift Operators (C# Reference)

The bitwise and shift operators include unary bitwise complement, binary left and right shift, unsigned right shift, and the binary logical AND, OR, and exclusive OR operators.

- Unary `~` (bitwise complement) operator
- Binary `<<` (left shift), `>>` (right shift), and `>>>` (unsigned right shift) operators
- Binary `&` (logical AND), `|` (logical OR), and `^` (logical exclusive OR) operators

These operands take operands of integral numeric types or the `char` type.

## Bitwise Complement Operator `~`

Reverses each bit:

```csharp
uint a = 0b_0000_1111_0000_1111_0000_1111_0000_1100;
uint b = ~a;
Console.WriteLine(Convert.ToString(b, toBase: 2));
// Output: 11110000111100001111000011110011
```

## Left-Shift Operator `<<`

Shifts left-hand operand left by the number of bits defined by the right-hand operand:

```csharp
uint x = 0b_1100_1001_0000_0000_0000_0000_0001_0001;
uint y = x << 4;
// Before: 11001001000000000000000000010001
// After:  10010000000000000000000100010000
```

## Right-Shift Operator `>>`

Shifts right. For signed types (`int`, `long`), performs arithmetic shift (sign bit propagated). For unsigned types (`uint`, `ulong`), performs logical shift (zeros fill):

```csharp
int a = int.MinValue;
int b = a >> 3;
// Before: 10000000000000000000000000000000
// After:  11110000000000000000000000000000  (sign bit preserved)
```

## Unsigned Right-Shift Operator `>>>`

Always performs logical shift regardless of the type:

```csharp
int x = -8;
int y = x >> 2;   // -2 (arithmetic shift)
int z = x >>> 2;  // 1073741822 (logical shift)
```

## Logical AND, XOR, OR Operators

```csharp
uint a = 0b_1111_1000;
uint b = 0b_1001_1101;
Console.WriteLine(Convert.ToString(a & b, 2));  // 10011000
Console.WriteLine(Convert.ToString(a ^ b, 2));  // 01100101
Console.WriteLine(Convert.ToString(a | b, 2));  // 11111101
```

## Compound Assignment

```csharp
uint a = 0b_1111_1000;
a &= 0b_1001_1101;   // 10011000
a |= 0b_0011_0001;   // 11111001
a ^= 0b_1000_0000;   // 01111000
a <<= 2;
a >>= 4;
a >>>= 4;
```

## Operator Precedence

From highest to lowest:

1. Bitwise complement `~`
2. Shift operators `<<`, `>>`, `>>>`
3. Logical AND `&`
4. Logical XOR `^`
5. Logical OR `|`

## Shift Count

For `int`/`uint`: shift count is `count & 0x1F` (low 5 bits).
For `long`/`ulong`: shift count is `count & 0x3F` (low 6 bits).

## Enumeration Logical Operators

Every enumeration type supports `~`, `&`, `|`, and `^` operators. Commonly used with `[Flags]` enumerations.

## Operator Overloadability

You can overload `~`, `<<`, `>>`, `>>>`, `&`, `|`, and `^`. Starting with C# 14, compound assignment operators can be explicitly overloaded.
