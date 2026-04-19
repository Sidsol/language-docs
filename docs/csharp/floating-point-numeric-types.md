---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/floating-point-numeric-types
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Floating-Point Numeric Types (C# Reference)

The floating-point numeric types represent real numbers. All are value types and simple types.

## Characteristics

| C# type | Approximate range | Precision | Size | .NET type |
|---|---|---|---|---|
| `float` | ±1.5 × 10⁻⁴⁵ to ±3.4 × 10³⁸ | ~6-9 digits | 4 bytes | System.Single |
| `double` | ±5.0 × 10⁻³²⁴ to ±1.7 × 10³⁰⁸ | ~15-17 digits | 8 bytes | System.Double |
| `decimal` | ±1.0 × 10⁻²⁸ to ±7.9228 × 10²⁸ | 28-29 digits | 16 bytes | System.Decimal |

The default value is zero (`0`). `float` and `double` provide `NaN`, `NegativeInfinity`, and `PositiveInfinity` constants.

### When to Use `decimal`

Use `decimal` when precision is determined by decimal digits (financial calculations, currency). Even 0.1 can be exactly represented by `decimal`, but not by `float` or `double`.

### Mixing Types

- **Integral + `float`/`double`**: integral types implicitly convert to floating-point; `float` implicitly converts to `double`
- **Integral + `decimal`**: integral types implicitly convert to `decimal`
- **`float`/`double` + `decimal`**: NOT allowed — must explicitly cast

```csharp
double a = 1.0;
decimal b = 2.1m;
Console.WriteLine(a + (double)b);    // cast decimal to double
Console.WriteLine((decimal)a + b);   // cast double to decimal
```

## Real Literals

| Suffix | Type |
|---|---|
| (none) or `d`/`D` | `double` |
| `f` or `F` | `float` |
| `m` or `M` | `decimal` |

```csharp
double d = 3.934_001;
float f = 3_000.5F;
decimal myMoney = 3_000.5m;
```

Scientific notation:

```csharp
double d = 0.42e2;    // 42
float f = 134.45E-2f; // 1.3445
decimal m = 1.5E6m;   // 1500000
```

## Conversions

Only one implicit conversion between floating-point types: `float` to `double`. Use explicit casts for all other conversions.
