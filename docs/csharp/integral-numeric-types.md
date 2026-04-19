---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/integral-numeric-types
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Integral Numeric Types (C# Reference)

The integral numeric types represent integer numbers. All are value types and simple types.

## Characteristics of the Integral Types

| C# type | Range | Size | .NET type |
|---|---|---|---|
| `sbyte` | -128 to 127 | Signed 8-bit | System.SByte |
| `byte` | 0 to 255 | Unsigned 8-bit | System.Byte |
| `short` | -32,768 to 32,767 | Signed 16-bit | System.Int16 |
| `ushort` | 0 to 65,535 | Unsigned 16-bit | System.UInt16 |
| `int` | -2,147,483,648 to 2,147,483,647 | Signed 32-bit | System.Int32 |
| `uint` | 0 to 4,294,967,295 | Unsigned 32-bit | System.UInt32 |
| `long` | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 | Signed 64-bit | System.Int64 |
| `ulong` | 0 to 18,446,744,073,709,551,615 | Unsigned 64-bit | System.UInt64 |
| `nint` | Platform-dependent | Signed 32/64-bit | System.IntPtr |
| `nuint` | Platform-dependent | Unsigned 32/64-bit | System.UIntPtr |

The default value of each integral type is zero (`0`). Each has `MinValue` and `MaxValue` properties.

## Integer Literals

```csharp
var decimalLiteral = 42;
var hexLiteral = 0x2A;
var binaryLiteral = 0b_0010_1010;
```

Use `_` as a digit separator for readability.

### Suffixes

| Suffix | Type |
|---|---|
| (none) | First of: `int`, `uint`, `long`, `ulong` |
| `U` or `u` | First of: `uint`, `ulong` |
| `L` or `l` | First of: `long`, `ulong` |
| `UL`, `LU`, etc. | `ulong` |

> **Tip**: Use `L` (uppercase) to avoid confusion with the digit `1`.

## Conversions

Any integral type can convert to any other. If the destination can store all source values, the conversion is implicit. Otherwise, use a cast:

```csharp
byte a = 17;       // OK: 17 fits in byte
byte b = 300;      // Error: 300 doesn't fit
var signedByte = (sbyte)42;  // explicit cast
```

## Native-Sized Integers

`nint` and `nuint` are 32-bit on 32-bit processes, 64-bit on 64-bit processes. Used for interop, low-level libraries, and performance-critical integer math.

```csharp
Console.WriteLine($"nint.MinValue = {nint.MinValue}");
Console.WriteLine($"nint.MaxValue = {nint.MaxValue}");
```

Compile-time constants are restricted to 32-bit range. No suffix exists — use casts:

```csharp
nint a = 42;
nint b = (nint)42;
```
