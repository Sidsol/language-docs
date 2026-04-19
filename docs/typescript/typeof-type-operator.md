---
sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/typeof-types.html"
fetchedAt: "2026-04-19T23:34:51.402Z"
language: "TypeScript"
title: "Typeof Type Operator"
---
# Typeof Type Operator

## The typeof type operator


JavaScript already has a `typeof` operator you can use in an *expression* context:


```
ts// Prints "string"console.log(typeof "Hello world");Try
```


TypeScript adds a `typeof` operator you can use in a *type* context to refer to the *type* of a variable or property:


```
tslet s = "hello";let n: typeof s;   let n: stringTry
```


This isn’t very useful for basic types, but combined with other type operators, you can use `typeof` to conveniently express many patterns.
For an example, let’s start by looking at the predefined type `ReturnType`.
It takes a *function type* and produces its return type:


```
tstype  boolean' >Predicate = (x: unknown) => boolean;type K =  any> = T extends (...args: any) => infer R ? R : any' >ReturnTypePredicate>;    type K = booleanTry
```


If we try to use `ReturnType` on a function name, we see an instructive error:


```
tsfunction f() {  return { x: 10, y: 3 };}type P =  any> = T extends (...args: any) => infer R ? R : any' >ReturnType;'f' refers to a value, but is being used as a type here. Did you mean 'typeof f'?2749'f' refers to a value, but is being used as a type here. Did you mean 'typeof f'?Try
```


Remember that *values* and *types* aren’t the same thing.
To refer to the *type* that the *value `f`* has, we use `typeof`:


```
tsfunction f() {  return { x: 10, y: 3 };}type P =  any> = T extends (...args: any) => infer R ? R : any' >ReturnType;    type P = {
    x: number;
    y: number;
}Try
```


### Limitations


TypeScript intentionally limits the sorts of expressions you can use `typeof` on.


Specifically, it’s only legal to use `typeof` on identifiers (i.e. variable names) or their properties.
This helps avoid the confusing trap of writing code you think is executing, but isn’t:


```
ts// Meant to use = ReturnTypelet  boolean' >shouldContinue: typeof  boolean' >msgbox("Are you sure you want to continue?");',' expected.1005',' expected.Try
```