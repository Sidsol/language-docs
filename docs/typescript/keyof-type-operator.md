---
sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/keyof-types.html"
fetchedAt: "2026-04-19T23:34:51.406Z"
language: "TypeScript"
title: "Keyof Type Operator"
---
# Keyof Type Operator

## The keyof type operator


The `keyof` operator takes an object type and produces a string or numeric literal union of its keys.
The following type `P` is the same type as `type P = "x" | "y"`:


```
tstype Point = { x: number; y: number };type P = keyof Point;    type P = keyof PointTry
```


If the type has a `string` or `number` index signature, `keyof` will return those types instead:


```
tstype Arrayish = { [n: number]: unknown };type A = keyof Arrayish;    type A = number type Mapish = { [k: string]: boolean };type M = keyof Mapish;    type M = string | numberTry
```


Note that in this example, `M` is `string | number` — this is because JavaScript object keys are always coerced to a string, so `obj[0]` is always the same as `obj["0"]`.


`keyof` types become especially useful when combined with mapped types, which we’ll learn more about later.