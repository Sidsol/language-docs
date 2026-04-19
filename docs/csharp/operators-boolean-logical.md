---
sourceUrl: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/boolean-logical-operators
fetchedAt: "2026-04-19T00:00:00Z"
language: "C#"
---

# Boolean Logical Operators - AND, OR, NOT, XOR

The logical Boolean operators perform logical operations with `bool` operands:

- Unary `!` (logical negation) operator
- Binary `&` (logical AND), `|` (logical OR), and `^` (logical exclusive OR) operators — always evaluate both operands
- Binary `&&` (conditional logical AND) and `||` (conditional logical OR) operators — evaluate the right-hand operand only if necessary

## Logical Negation Operator `!`

The unary prefix `!` operator computes logical negation:

```csharp
bool passed = false;
Console.WriteLine(!passed);  // output: True
Console.WriteLine(!true);    // output: False
```

The unary postfix `!` operator is the null-forgiving operator.

## Logical AND Operator `&`

Computes the logical AND, always evaluating both operands:

```csharp
bool a = false & SecondOperand(); // SecondOperand() is always called
bool b = true & SecondOperand();
```

## Logical Exclusive OR Operator `^`

```csharp
Console.WriteLine(true ^ true);    // output: False
Console.WriteLine(true ^ false);   // output: True
Console.WriteLine(false ^ true);   // output: True
Console.WriteLine(false ^ false);  // output: False
```

## Logical OR Operator `|`

Computes logical OR, always evaluating both operands.

## Conditional Logical AND Operator `&&`

Short-circuiting: doesn't evaluate the right operand if the left is `false`:

```csharp
bool a = false && SecondOperand(); // SecondOperand() is NOT called
bool b = true && SecondOperand();  // SecondOperand() IS called
```

## Conditional Logical OR Operator `||`

Short-circuiting: doesn't evaluate the right operand if the left is `true`:

```csharp
bool a = true || SecondOperand();  // SecondOperand() is NOT called
bool b = false || SecondOperand(); // SecondOperand() IS called
```

## Nullable Boolean Logical Operators

For `bool?` operands, `&` and `|` support three-valued logic:

| x | y | x & y | x \| y |
|---|---|-------|--------|
| true | true | true | true |
| true | false | false | true |
| true | null | null | true |
| false | true | false | true |
| false | false | false | false |
| false | null | false | null |
| null | true | null | true |
| null | false | false | null |
| null | null | null | null |

The `&&` and `||` operators don't support `bool?` operands.

## Compound Assignment

```csharp
bool test = true;
test &= false;   // test = false
test |= true;    // test = true
test ^= false;   // test = true
```

The `&&` and `||` operators don't support compound assignment.

## Operator Precedence

From highest to lowest:

1. Logical negation `!`
2. Logical AND `&`
3. Logical XOR `^`
4. Logical OR `|`
5. Conditional AND `&&`
6. Conditional OR `||`

```csharp
Console.WriteLine(true | true & false);   // output: True (& evaluated first)
Console.WriteLine((true | true) & false); // output: False
```

## Operator Overloadability

A user-defined type can overload `!`, `&`, `|`, and `^`. Starting with C# 14, compound assignment operators can be explicitly overloaded. The `&&` and `||` operators can't be directly overloaded, but if a type overloads `true`/`false` operators and `&` or `|`, then `&&` or `||` can be evaluated for that type.
