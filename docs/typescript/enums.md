---
sourceUrl: "https://www.typescriptlang.org/docs/handbook/enums.html"
fetchedAt: "2026-04-19T23:34:52.104Z"
language: "TypeScript"
title: "Enums"
---
# Enums

Enums are one of the few features TypeScript has which is not a type-level extension of JavaScript.


Enums allow a developer to define a set of named constants.
Using enums can make it easier to document intent, or create a set of distinct cases.
TypeScript provides both numeric and string-based enums.


## Numeric enums


We’ll first start off with numeric enums, which are probably more familiar if you’re coming from other languages.
An enum can be defined using the `enum` keyword.


```
tsenum Direction {  Up = 1,  Down,  Left,  Right,}Try
```


Above, we have a numeric enum where `Up` is initialized with `1`.
All of the following members are auto-incremented from that point on.
In other words, `Direction.Up` has the value `1`, `Down` has `2`, `Left` has `3`, and `Right` has `4`.


If we wanted, we could leave off the initializers entirely:


```
tsenum Direction {  Up,  Down,  Left,  Right,}Try
```


Here, `Up` would have the value `0`, `Down` would have `1`, etc.
This auto-incrementing behavior is useful for cases where we might not care about the member values themselves, but do care that each value is distinct from other values in the same enum.


Using an enum is simple: just access any member as a property off of the enum itself, and declare types using the name of the enum:


```
tsenum UserResponse {  No = 0,  Yes = 1,} function respond(recipient: string, message: UserResponse): void {  // ...} respond("Princess Caroline", UserResponse.Yes);Try
```


Numeric enums can be mixed in computed and constant members (see below).
The short story is, enums without initializers either need to be first, or have to come after numeric enums initialized with numeric constants or other constant enum members.
In other words, the following isn’t allowed:


```
tsenum E {  A =  number' >getSomeValue(),  B,Enum member must have initializer.1061Enum member must have initializer.}Try
```


## String enums


String enums are a similar concept, but have some subtle runtime differences as documented below.
In a string enum, each member has to be constant-initialized with a string literal, or with another string enum member.


```
tsenum Direction {  Up = "UP",  Down = "DOWN",  Left = "LEFT",  Right = "RIGHT",}Try
```


While string enums don’t have auto-incrementing behavior, string enums have the benefit that they “serialize” well.
In other words, if you were debugging and had to read the runtime value of a numeric enum, the value is often opaque - it doesn’t convey any useful meaning on its own (though reverse mapping can often help). String enums allow you to give a meaningful and readable value when your code runs, independent of the name of the enum member itself.


## Heterogeneous enums


Technically enums can be mixed with string and numeric members, but it’s not clear why you would ever want to do so:


```
tsenum BooleanLikeHeterogeneousEnum {  No = 0,  Yes = "YES",}Try
```


Unless you’re really trying to take advantage of JavaScript’s runtime behavior in a clever way, it’s advised that you don’t do this.


## Computed and constant members


Each enum member has a value associated with it which can be either *constant* or *computed*.
An enum member is considered constant if:


- It is the first member in the enum and it has no initializer, in which case it’s assigned the value `0`:

```
ts// E.X is constant:enum E {  X,}Try
```

- It does not have an initializer and the preceding enum member was a *numeric* constant.
In this case the value of the current enum member will be the value of the preceding enum member plus one.

```
ts// All enum members in &apos;E1&apos; and &apos;E2&apos; are constant. enum E1 {  X,  Y,  Z,} enum E2 {  A = 1,  B,  C,}Try
```

- The enum member is initialized with a constant enum expression.
A constant enum expression is a subset of TypeScript expressions that can be fully evaluated at compile time.
An expression is a constant enum expression if it is:

a literal enum expression (basically a string literal or a numeric literal)

- a reference to previously defined constant enum member (which can originate from a different enum)

- a parenthesized constant enum expression

- one of the `+`, `-`, `~` unary operators applied to constant enum expression

- `+`, `-`, `*`, `/`, `%`, `>`, `>>>`, `&`, `|`, `^` binary operators with constant enum expressions as operands


It is a compile time error for constant enum expressions to be evaluated to `NaN` or `Infinity`.


In all other cases enum member is considered computed.


```
tsenum FileAccess {  // constant members  None,  Read = 1  `value`) and reverse (`value` -> `name`) mappings.
References to other enum members are always emitted as property accesses and never inlined.


Keep in mind that string enum members *do not* get a reverse mapping generated at all.


### const enums


In most cases, enums are a perfectly valid solution.
However sometimes requirements are tighter.
To avoid paying the cost of extra generated code and additional indirection when accessing enum values, it’s possible to use `const` enums.
Const enums are defined using the `const` modifier on our enums:


```
tsconst enum Enum {  A = 1,  B = A * 2,}Try
```


Const enums can only use constant enum expressions and unlike regular enums they are completely removed during compilation.
Const enum members are inlined at use sites.
This is possible since const enums cannot have computed members.


```
tsconst enum Direction {  Up,  Down,  Left,  Right,} let directions = [  Direction.Up,  Direction.Down,  Direction.Left,  Direction.Right,];Try
```


in generated code will become


```
ts"use strict";let directions = [    0 /* Direction.Up */,    1 /* Direction.Down */,    2 /* Direction.Left */,    3 /* Direction.Right */,]; Try
```


#### Const enum pitfalls


Inlining enum values is straightforward at first, but comes with subtle implications.
These pitfalls pertain to *ambient* const enums only (basically const enums in `.d.ts` files) and sharing them between projects, but if you are publishing or consuming `.d.ts` files, these pitfalls likely apply to you, because `tsc --declaration` transforms `.ts` files into `.d.ts` files.


- For the reasons laid out in the [`isolatedModules` documentation](https://www.typescriptlang.org/tsconfig#references-to-const-enum-members), that mode is fundamentally incompatible with ambient const enums.
This means if you publish ambient const enums, downstream consumers will not be able to use [`isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) and those enum values at the same time.

- You can easily inline values from version A of a dependency at compile time, and import version B at runtime.
Version A and B’s enums can have different values, if you are not very careful, resulting in [surprising bugs](https://github.com/microsoft/TypeScript/issues/5219#issue-110947903), like taking the wrong branches of `if` statements.
These bugs are especially pernicious because it is common to run automated tests at roughly the same time as projects are built, with the same dependency versions, which misses these bugs completely.

- [`importsNotUsedAsValues: "preserve"`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues) will not elide imports for const enums used as values, but ambient const enums do not guarantee that runtime `.js` files exist.
The unresolvable imports cause errors at runtime.
The usual way to unambiguously elide imports, [type-only imports](https://www.typescriptlang.org/docs/handbook/modules/reference.html#type-only-imports-and-exports), [does not allow const enum values](https://github.com/microsoft/TypeScript/issues/40344), currently.


Here are two approaches to avoiding these pitfalls:


- Do not use const enums at all.
You can easily [ban const enums](https://typescript-eslint.io/linting/troubleshooting#how-can-i-ban-specific-language-feature) with the help of a linter.
Obviously this avoids any issues with const enums, but prevents your project from inlining its own enums.
Unlike inlining enums from other projects, inlining a project’s own enums is not problematic and has performance implications.

- Do not publish ambient const enums, by deconstifying them with the help of [`preserveConstEnums`](https://www.typescriptlang.org/tsconfig#preserveConstEnums).
This is the approach taken internally by the [TypeScript project itself](https://github.com/microsoft/TypeScript/pull/5422).
[`preserveConstEnums`](https://www.typescriptlang.org/tsconfig#preserveConstEnums) emits the same JavaScript for const enums as plain enums.
You can then safely strip the `const` modifier from `.d.ts` files [in a build step](https://github.com/microsoft/TypeScript/blob/1a981d1df1810c868a66b3828497f049a944951c/Gulpfile.js#L144).
This way downstream consumers will not inline enums from your project, avoiding the pitfalls above, but a project can still inline its own enums, unlike banning const enums entirely.


## Ambient enums


Ambient enums are used to describe the shape of already existing enum types.


```
tsdeclare enum Enum {  A = 1,  B,  C = 2,}Try
```


One important difference between ambient and non-ambient enums is that, in regular enums, members that don’t have an initializer will be considered constant if its preceding enum member is considered constant.
By contrast, an ambient (and non-const) enum member that does not have an initializer is *always* considered computed.


## Objects vs Enums


In modern TypeScript, you may not need an enum when an object with `as const` could suffice:


```
tsconst enum EDirection {  Up,  Down,  Left,  Right,} const ODirection = {  Up: 0,  Down: 1,  Left: 2,  Right: 3,} as const; EDirection.Up;           (enum member) EDirection.Up = 0 ODirection.Up;           (property) Up: 0 // Using the enum as a parameterfunction walk(dir: EDirection) {} // It requires an extra line to pull out the valuestype Direction = typeof ODirection[keyof typeof ODirection];function run(dir: Direction) {} walk(EDirection.Left);run(ODirection.Right);Try
```


The biggest argument in favour of this format over TypeScript’s `enum` is that it keeps your codebase aligned with the state of JavaScript, and [when/if](https://github.com/rbuckton/proposal-enum) enums are added to JavaScript then you can move to the additional syntax.