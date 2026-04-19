---
sourceUrl: "https://www.typescriptlang.org/docs/handbook/utility-types.html"
fetchedAt: "2026-04-19T23:34:52.012Z"
language: "TypeScript"
title: "Utility Types"
---
# Utility Types

TypeScript provides several utility types to facilitate common type transformations. These utilities are available globally.


## Awaited<Type>


> Released:
> [4.5](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#the-awaited-type-and-promise-improvements)


This type is meant to model operations like `await` in `async` functions, or the
`.then()` method on `Promise`s - specifically, the way that they recursively
unwrap `Promise`s.


##### Example


```
tstype A =  = T extends null | undefined ? T : T extends object & {
    then(onfulfilled: infer F, ...args: infer _): any;
} ? F extends (value: infer V, ...args: infer _) => any ? Awaited : never : T' >AwaitedPromise>;    type A = string type B =  = T extends null | undefined ? T : T extends object & {
    then(onfulfilled: infer F, ...args: infer _): any;
} ? F extends (value: infer V, ...args: infer _) => any ? Awaited : never : T' >AwaitedPromisePromise>>;    type B = number type C =  = T extends null | undefined ? T : T extends object & {
    then(onfulfilled: infer F, ...args: infer _): any;
} ? F extends (value: infer V, ...args: infer _) => any ? Awaited : never : T' >AwaitedPromise>;    type C = number | booleanTry
```


## Partial<Type>


> Released:
> [2.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)


Constructs a type with all properties of `Type` set to optional. This utility will return a type that represents all subsets of a given type.


##### Example


```
tsinterface Todo {  title: string;  description: string;} function ): {
    title: string;
    description: string;
}' >updateTodo(todo: Todo, ' >fieldsToUpdate:  = { [P in keyof T]?: T[P] | undefined; }' >Partial) {  return { ...todo, ...' >fieldsToUpdate };} const todo1 = {  title: "organize desk",  description: "clear clutter",}; const todo2 = ): {
    title: string;
    description: string;
}' >updateTodo(todo1, {  description: "throw out trash",});Try
```


## Required<Type>


> Released:
> [2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#improved-control-over-mapped-type-modifiers)


Constructs a type consisting of all properties of `Type` set to required. The opposite of `Partial`.


##### Example


```
tsinterface Props {  a?: number;  b?: string;} const obj: Props = { a: 5 }; const ' >obj2:  = { [P in keyof T]-?: T[P]; }' >Required= { a: 5 };Property 'b' is missing in type '{ a: number; }' but required in type 'Required'.2741Property 'b' is missing in type '{ a: number; }' but required in type 'Required'.Try
```


## Readonly<Type>


> Released:
> [2.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)


Constructs a type with all properties of `Type` set to `readonly`, meaning the properties of the constructed type cannot be reassigned.


##### Example


```
tsinterface Todo {  title: string;} const ' >todo:  = { readonly [P in keyof T]: T[P]; }' >Readonly = {  title: "Delete inactive users",}; ' >todo.title = "Hello";Cannot assign to 'title' because it is a read-only property.2540Cannot assign to 'title' because it is a read-only property.Try
```


This utility is useful for representing assignment expressions that will fail at runtime (i.e. when attempting to reassign properties of a [frozen object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)).


##### Object.freeze


```
tsfunction freeze(obj: Type): Readonly;
```


## Record<Keys, Type>


> Released:
> [2.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)


Constructs an object type whose property keys are `Keys` and whose property values are `Type`. This utility can be used to map the properties of a type to another type.


##### Example


```
tstype CatName = "miffy" | "boris" | "mordred"; interface CatInfo {  age: number;  breed: string;} const ' >cats:  = { [P in K]: T; }' >Record = {  miffy: { age: 10, breed: "Persian" },  boris: { age: 5, breed: "Maine Coon" },  mordred: { age: 16, breed: "British Shorthair" },}; ' style='border-bottom: solid 2px lightgrey;'>cats.boris; const cats: RecordTry
```


## Pick<Type, Keys>


> Released:
> [2.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)


Constructs a type by picking the set of properties `Keys` (string literal or union of string literals) from `Type`.


##### Example


```
tsinterface Todo {  title: string;  description: string;  completed: boolean;} type TodoPreview =  = { [P in K]: T[P]; }' >Pick; const todo: TodoPreview = {  title: "Clean room",  completed: false,}; todo; const todo: TodoPreviewTry
```


## Omit<Type, Keys>


> Released:
> [3.5](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type)


Constructs a type by picking all properties from `Type` and then removing `Keys` (string literal or union of string literals). The opposite of `Pick`.


##### Example


```
tsinterface Todo {  title: string;  description: string;  completed: boolean;  createdAt: number;} type TodoPreview =  = { [P in Exclude]: T[P]; }' >Omit; const todo: TodoPreview = {  title: "Clean room",  completed: false,  createdAt: 1615544252770,}; todo; const todo: TodoPreview type TodoInfo =  = { [P in Exclude]: T[P]; }' >Omit; const todoInfo: TodoInfo = {  title: "Pick up kids",  description: "Kindergarten closes at 5pm",}; todoInfo;   const todoInfo: TodoInfoTry
```


## Exclude<UnionType, ExcludedMembers>


> Released:
> [2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)


Constructs a type by excluding from `UnionType` all union members that are assignable to `ExcludedMembers`.


##### Example


```
tstype T0 =  = T extends U ? never : T' >Exclude;     type T0 = "b" | "c"type T1 =  = T extends U ? never : T' >Exclude;     type T1 = "c"type T2 =  = T extends U ? never : T' >Exclude void), Function>;     type T2 = string | number type Shape =  | { kind: "circle"; radius: number }  | { kind: "square"; x: number }  | { kind: "triangle"; x: number; y: number }; type T3 =  = T extends U ? never : T' >Exclude     type T3 = {
    kind: "square";
    x: number;
} | {
    kind: "triangle";
    x: number;
    y: number;
}Try
```


## Extract<Type, Union>


> Released:
> [2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)


Constructs a type by extracting from `Type` all union members that are assignable to `Union`.


##### Example


```
tstype T0 =  = T extends U ? T : never' >Extract;     type T0 = "a"type  void' style='border-bottom: solid 2px lightgrey;'>T1 =  = T extends U ? T : never' >Extract void), Function>;     type T1 = () => void type Shape =  | { kind: "circle"; radius: number }  | { kind: "square"; x: number }  | { kind: "triangle"; x: number; y: number }; type T2 =  = T extends U ? T : never' >Extract     type T2 = {
    kind: "circle";
    radius: number;
}Try
```


## NonNullable<Type>


> Released:
> [2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)


Constructs a type by excluding `null` and `undefined` from `Type`.


##### Example


```
tstype T0 =  = T & {}' >NonNullable;     type T0 = string | numbertype T1 =  = T & {}' >NonNullable;     type T1 = string[]Try
```


## Parameters<Type>


> Released:
> [3.1](https://github.com/microsoft/TypeScript/pull/26243)


Constructs a tuple type from the types used in the parameters of a function type `Type`.


For overloaded functions, this will be the parameters of the *last* signature; see [Inferring Within Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types).


##### Example


```
tsdeclare function f1(arg: { a: number; b: string }): void; type T0 =  any> = T extends (...args: infer P) => any ? P : never' >Parameters string>;     type T0 = []type T1 =  any> = T extends (...args: infer P) => any ? P : never' >Parameters void>;     type T1 = [s: string]type T2 =  any> = T extends (...args: infer P) => any ? P : never' >ParametersT>(arg: (arg: T): T' >T) => (arg: T): T' >T>;     type T2 = [arg: unknown]type T3 =  any> = T extends (...args: infer P) => any ? P : never' >Parameters;     type T3 = [arg: {
    a: number;
    b: string;
}]type T4 =  any> = T extends (...args: infer P) => any ? P : never' >Parameters;     type T4 = unknown[]type T5 =  any> = T extends (...args: infer P) => any ? P : never' >Parameters;     type T5 = nevertype T6 =  any> = T extends (...args: infer P) => any ? P : never' >Parameters;Type 'string' does not satisfy the constraint '(...args: any) => any'.2344Type 'string' does not satisfy the constraint '(...args: any) => any'.     type T6 = nevertype T7 =  any> = T extends (...args: infer P) => any ? P : never' >Parameters;Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  Type 'Function' provides no match for the signature '(...args: any): any'.2344Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  Type 'Function' provides no match for the signature '(...args: any): any'.     type T7 = neverTry
```


## ConstructorParameters<Type>


> Released:
> [3.1](https://github.com/microsoft/TypeScript/pull/26243)


Constructs a tuple or array type from the types of a constructor function type. It produces a tuple type with all the parameter types (or the type `never` if `Type` is not a function).


##### Example


```
tstype T0 =  any> = T extends abstract new (...args: infer P) => any ? P : never' >ConstructorParameters;     type T0 = [message?: string]type T1 =  any> = T extends abstract new (...args: infer P) => any ? P : never' >ConstructorParameters;     type T1 = string[]type T2 =  any> = T extends abstract new (...args: infer P) => any ? P : never' >ConstructorParameters;     type T2 = [pattern: string | RegExp, flags?: string]class C {  constructor(a: number, b: string) {}}type T3 =  any> = T extends abstract new (...args: infer P) => any ? P : never' >ConstructorParameters;     type T3 = [a: number, b: string]type T4 =  any> = T extends abstract new (...args: infer P) => any ? P : never' >ConstructorParameters;     type T4 = unknown[] type T5 =  any> = T extends abstract new (...args: infer P) => any ? P : never' >ConstructorParameters;Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
  Type 'Function' provides no match for the signature 'new (...args: any): any'.2344Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
  Type 'Function' provides no match for the signature 'new (...args: any): any'.     type T5 = neverTry
```


## ReturnType<Type>


> Released:
> [2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)


Constructs a type consisting of the return type of function `Type`.


For overloaded functions, this will be the return type of the *last* signature; see [Inferring Within Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types).


##### Example


```
tsdeclare function f1(): { a: number; b: string }; type T0 =  any> = T extends (...args: any) => infer R ? R : any' >ReturnType string>;     type T0 = stringtype T1 =  any> = T extends (...args: any) => infer R ? R : any' >ReturnType void>;     type T1 = voidtype T2 =  any> = T extends (...args: any) => infer R ? R : any' >ReturnTypeT>() => (): T' >T>;     type T2 = unknowntype T3 =  any> = T extends (...args: any) => infer R ? R : any' >ReturnTypeT extends (): T' >U, (): T' >U extends number[]>() => (): T' >T>;     type T3 = number[]type T4 =  any> = T extends (...args: any) => infer R ? R : any' >ReturnType;     type T4 = {
    a: number;
    b: string;
}type T5 =  any> = T extends (...args: any) => infer R ? R : any' >ReturnType;     type T5 = anytype T6 =  any> = T extends (...args: any) => infer R ? R : any' >ReturnType;     type T6 = nevertype T7 =  any> = T extends (...args: any) => infer R ? R : any' >ReturnType;Type 'string' does not satisfy the constraint '(...args: any) => any'.2344Type 'string' does not satisfy the constraint '(...args: any) => any'.     type T7 = anytype T8 =  any> = T extends (...args: any) => infer R ? R : any' >ReturnType;Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  Type 'Function' provides no match for the signature '(...args: any): any'.2344Type 'Function' does not satisfy the constraint '(...args: any) => any'.
  Type 'Function' provides no match for the signature '(...args: any): any'.     type T8 = anyTry
```


## InstanceType<Type>


> Released:
> [2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)


Constructs a type consisting of the instance type of a constructor function in `Type`.


##### Example


```
tsclass C {  x = 0;  y = 0;} type T0 =  any> = T extends abstract new (...args: any) => infer R ? R : any' >InstanceType;     type T0 = Ctype T1 =  any> = T extends abstract new (...args: any) => infer R ? R : any' >InstanceType;     type T1 = anytype T2 =  any> = T extends abstract new (...args: any) => infer R ? R : any' >InstanceType;     type T2 = nevertype T3 =  any> = T extends abstract new (...args: any) => infer R ? R : any' >InstanceType;Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'.2344Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'.     type T3 = anytype T4 =  any> = T extends abstract new (...args: any) => infer R ? R : any' >InstanceType;Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
  Type 'Function' provides no match for the signature 'new (...args: any): any'.2344Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
  Type 'Function' provides no match for the signature 'new (...args: any): any'.     type T4 = anyTry
```


## NoInfer<Type>


> Released:
> [5.4](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html#the-noinfer-utility-type)


Blocks inferences to the contained type. Other than blocking inferences, `NoInfer` is
identical to `Type`.


##### Example


```
tsfunction createStreetLight(  colors: C[],  defaultColor?: NoInfer,) {  // ...}createStreetLight(["red", "yellow", "green"], "red");  // OKcreateStreetLight(["red", "yellow", "green"], "blue");  // Error
```


## ThisParameterType<Type>


> Released:
> [3.3](https://github.com/microsoft/TypeScript/pull/28920)


Extracts the type of the [this](https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters) parameter for a function type, or [unknown](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) if the function type has no `this` parameter.


##### Example


```
tsfunction toHex(this: Number) {  return this.toString(16);} function ): string' >numberToString(n:  = T extends (this: infer U, ...args: never) => any ? U : unknown' >ThisParameterType) {  return toHex.(this: (this: Number) => string, thisArg: Number): string (+1 overload)' >apply(n);}Try
```


## OmitThisParameter<Type>


> Released:
> [3.3](https://github.com/microsoft/TypeScript/pull/28920)


Removes the [`this`](https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters) parameter from `Type`. If `Type` has no explicitly declared `this` parameter, the result is simply `Type`. Otherwise, a new function type with no `this` parameter is created from `Type`. Generics are erased and only the last overload signature is propagated into the new function type.


##### Example


```
tsfunction toHex(this: Number) {  return this.toString(16);} const  string' >fiveToHex:  = unknown extends ThisParameterType ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T' >OmitThisParameter = toHex. string>(this: (this: Number) => string, thisArg: Number): () => string (+1 overload)' >bind(5); console.log( string' >fiveToHex());Try
```


## ThisType<Type>


> Released:
> [2.3](https://github.com/microsoft/TypeScript/pull/14141)


This utility does not return a transformed type. Instead, it serves as a marker for a contextual [`this`](https://www.typescriptlang.org/docs/handbook/functions.html#this) type. Note that the [`noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis) flag must be enabled to use this utility.


##### Example


```
tstype  = {
    data?: D;
    methods?: M & ThisType;
}' >ObjectDescriptorD, ' >M> = {  data?: ' >D;  ) | undefined' >methods?: ' >M & ' >ThisTypeD & ' >M>; // Type of &apos;this&apos; in methods is D & M}; function (desc: ObjectDescriptor): D & M' >makeObject): D & M' >D, (desc: ObjectDescriptor): D & M' >M>(' >desc:  = {
    data?: D;
    methods?: M & ThisType;
}' >ObjectDescriptor): D & M' >D, (desc: ObjectDescriptor): D & M' >M>): (desc: ObjectDescriptor): D & M' >D & (desc: ObjectDescriptor): D & M' >M {  let data: object = ' >desc.data || {};  let methods: object = ' >desc.) | undefined' >methods || {};  return { ...data, ...methods } as (desc: ObjectDescriptor): D & M' >D & (desc: ObjectDescriptor): D & M' >M;} let obj = (desc: ObjectDescriptor): {
    x: number;
    y: number;
} & {
    moveBy(dx: number, dy: number): void;
}' >makeObject({  data: { x: 0, y: 0 },  ) | undefined' >methods: {    moveBy(dx: number, dy: number) {      this.x += dx; // Strongly typed this      this.y += dy; // Strongly typed this    },  },}); obj.x = 10;obj.y = 20;obj.moveBy(5, 5);Try
```


In the example above, the `methods` object in the argument to `makeObject` has a contextual type that includes `ThisType` and therefore the type of [this](https://www.typescriptlang.org/docs/handbook/functions.html#this) in methods within the `methods` object is `{ x: number, y: number } & { moveBy(dx: number, dy: number): void }`. Notice how the type of the `methods` property simultaneously is an inference target and a source for the `this` type in methods.


The `ThisType` marker interface is simply an empty interface declared in `lib.d.ts`. Beyond being recognized in the contextual type of an object literal, the interface acts like any empty interface.


## Intrinsic String Manipulation Types


### Uppercase<StringType>


### Lowercase<StringType>


### Capitalize<StringType>


### Uncapitalize<StringType>


To help with string manipulation around template string literals, TypeScript includes a set of types which can be used in string manipulation within the type system. You can find those in the [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#uppercasestringtype) documentation.