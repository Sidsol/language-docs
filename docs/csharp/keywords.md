---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# C# Keywords

Keywords are predefined, reserved identifiers that have special meanings to the compiler. You can't use them as identifiers in your program unless you prefix them with `@`. For example, `@if` is a valid identifier, but `if` isn't because `if` is a keyword.

## Reserved Keywords

| | | | | |
|---|---|---|---|---|
| `abstract` | `as` | `base` | `bool` | `break` |
| `byte` | `case` | `catch` | `char` | `checked` |
| `class` | `const` | `continue` | `decimal` | `default` |
| `delegate` | `do` | `double` | `else` | `enum` |
| `event` | `explicit` | `extern` | `false` | `finally` |
| `fixed` | `float` | `for` | `foreach` | `goto` |
| `if` | `implicit` | `in` | `int` | `interface` |
| `internal` | `is` | `lock` | `long` | `namespace` |
| `new` | `null` | `object` | `operator` | `out` |
| `override` | `params` | `private` | `protected` | `public` |
| `readonly` | `ref` | `return` | `sbyte` | `sealed` |
| `short` | `sizeof` | `stackalloc` | `static` | `string` |
| `struct` | `switch` | `this` | `throw` | `true` |
| `try` | `typeof` | `uint` | `ulong` | `unchecked` |
| `unsafe` | `ushort` | `using` | `virtual` | `void` |
| `volatile` | `while` | | | |

## Contextual Keywords

A contextual keyword provides a specific meaning in the code, but it isn't a reserved word in C#. Some contextual keywords, such as `partial` and `where`, have special meanings in two or more contexts.

| | | | | |
|---|---|---|---|---|
| `add` | `allows` | `alias` | `and` | `ascending` |
| `args` | `async` | `await` | `by` | `descending` |
| `dynamic` | `equals` | `field` | `file` | `from` |
| `get` | `global` | `group` | `init` | `into` |
| `join` | `let` | `managed` | `nameof` | `nint` |
| `not` | `notnull` | `nuint` | `on` | `or` |
| `orderby` | `partial` (type) | `partial` (member) | `record` | `remove` |
| `required` | `scoped` | `select` | `set` | `unmanaged` |
| `value` | `var` | `when` | `where` (generic) | `where` (query) |
| `with` | `yield` | | | |

## Related Topics

- **Access Modifiers**: `public`, `private`, `protected`, `internal` control the accessibility of types and members.
- **Statement Keywords**: `if`, `else`, `switch`, `for`, `foreach`, `while`, `do`, `break`, `continue`, `return`, `goto`, `throw`, `try`, `catch`, `finally`, `using`, `lock`, `yield`.
- **Method Parameters**: `params`, `ref`, `out`, `in` modify how arguments are passed to methods.
- **Type Keywords**: `class`, `struct`, `interface`, `enum`, `delegate`, `record` define types.
- **Operator Keywords**: `as`, `is`, `new`, `sizeof`, `typeof`, `stackalloc`, `checked`, `unchecked`.
- **Namespace Keywords**: `namespace`, `using`, `extern alias`.
- **Generic Type Constraint Keywords**: `where`, `new()`, `class`, `struct`, `notnull`, `unmanaged`.
- **Query Keywords**: `from`, `where`, `select`, `group`, `into`, `orderby`, `join`, `let`, `ascending`, `descending`, `on`, `equals`, `by`.
