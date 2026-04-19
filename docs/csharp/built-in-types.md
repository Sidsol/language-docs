---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/built-in-types
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Built-in Types (C# Reference)

## Built-in Value Types

| C# type keyword | .NET type |
|---|---|
| `bool` | System.Boolean |
| `byte` | System.Byte |
| `sbyte` | System.SByte |
| `char` | System.Char |
| `decimal` | System.Decimal |
| `double` | System.Double |
| `float` | System.Single |
| `int` | System.Int32 |
| `uint` | System.UInt32 |
| `nint` | System.IntPtr |
| `nuint` | System.UIntPtr |
| `long` | System.Int64 |
| `ulong` | System.UInt64 |
| `short` | System.Int16 |
| `ushort` | System.UInt16 |

## Built-in Reference Types

| C# type keyword | .NET type |
|---|---|
| `object` | System.Object |
| `string` | System.String |
| `delegate` | System.Delegate |
| `dynamic` | System.Object |

Most C# type keywords are aliases for corresponding .NET types. They're interchangeable:

```csharp
int a = 123;
System.Int32 b = 123;
```

## `dynamic` vs `object`

- `dynamic`: Operations are bound at runtime, not compile time. You can't use `new dynamic()` or derive from it.
- `object`: Operations are bound at compile time.

## `delegate` Keyword

Declares a custom type derived from `System.Delegate`. Unlike other built-in type keywords, `delegate` isn't an alias for a specific .NET type.

## `void`

Represents the absence of a type. Used as the return type of a method that doesn't return a value.

## Span Types

The language includes specialized rules for `System.Span<T>` and `System.ReadOnlySpan<T>`:

- From any single-dimensional array `E[]` to `Span<E>` or `ReadOnlySpan<U>` (with identity/covariance conversion)
- From `Span<E>` to `ReadOnlySpan<U>`
- From `string` to `ReadOnlySpan<char>`
