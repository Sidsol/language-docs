---
sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html"
fetchedAt: "2026-04-19T23:34:51.760Z"
language: "TypeScript"
title: "Mapped Types"
---
# Mapped Types

When you don’t want to repeat yourself, sometimes a type needs to be based on another type.


Mapped types build on the syntax for index signatures, which are used to declare the types of properties which have not been declared ahead of time:


```
tstype OnlyBoolsAndHorses = {  [key: string]: boolean | Horse;}; const conforms: OnlyBoolsAndHorses = {  del: true,  rodney: false,};Try
```


A mapped type is a generic type which uses a union of `PropertyKey`s (frequently created [via a `keyof`](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)) to iterate through keys to create a type:


```
tstype  = { [Property in keyof Type]: boolean; }' >OptionsFlagsType> = {  [Property in keyof ' >Type]: boolean;};Try
```


In this example, `OptionsFlags` will take all the properties from the type `Type` and change their values to be a boolean.


```
tstype  void;
    newUserProfile: () => void;
}' >Features = {   void' >darkMode: () => void;   void' >newUserProfile: () => void;}; type FeatureOptions =  = { [Property in keyof Type]: boolean; }' >OptionsFlags void;
}' >Features>;           type FeatureOptions = {
    darkMode: boolean;
    newUserProfile: boolean;
}Try
```


### Mapping Modifiers


There are two additional modifiers which can be applied during mapping: `readonly` and `?` which affect mutability and optionality respectively.


You can remove or add these modifiers by prefixing with `-` or `+`. If you don’t add a prefix, then `+` is assumed.


```
ts// Removes &apos;readonly&apos; attributes from a type&apos;s propertiestype  = { -readonly [Property in keyof Type]: Type[Property]; }' >CreateMutableType> = {  -readonly [Property in keyof ' >Type]: ' >Type[Property];}; type LockedAccount = {  readonly id: string;  readonly name: string;}; type UnlockedAccount =  = { -readonly [Property in keyof Type]: Type[Property]; }' >CreateMutable;           type UnlockedAccount = {
    id: string;
    name: string;
}Try
```


```
ts// Removes &apos;optional&apos; attributes from a type&apos;s propertiestype  = { [Property in keyof Type]-?: Type[Property]; }' >ConcreteType> = {  [Property in keyof ' >Type]-?: ' >Type[Property];}; type MaybeUser = {  id: string;  name?: string;  age?: number;}; type User =  = { [Property in keyof Type]-?: Type[Property]; }' >Concrete;      type User = {
    id: string;
    name: string;
    age: number;
}Try
```


## Key Remapping via as


In TypeScript 4.1 and onwards, you can re-map keys in mapped types with an `as` clause in a mapped type:


```
tstype MappedTypeWithNewProperties = {    [Properties in keyof Type as NewKeyType]: Type[Properties]}
```


You can leverage features like [template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) to create new property names from prior ones:


```
tstype  = { [Property in keyof Type as `get${Capitalize}`]: () => Type[Property]; }' >GettersType> = {    [Property in keyof ' >Type as `get${ = intrinsic' >Capitalize}`]: () => ' >Type[Property]}; interface Person {    name: string;    age: number;    location: string;} type  string;
    getAge: () => number;
    getLocation: () => string;
}' style='border-bottom: solid 2px lightgrey;'>LazyPerson =  = { [Property in keyof Type as `get${Capitalize}`]: () => Type[Property]; }' >Getters;         type LazyPerson = {
    getName: () => string;
    getAge: () => number;
    getLocation: () => string;
}Try
```


You can filter out keys by producing `never` via a conditional type:


```
ts// Remove the &apos;kind&apos; propertytype  = { [Property in keyof Type as Exclude]: Type[Property]; }' >RemoveKindFieldType> = {    [Property in keyof ' >Type as  = T extends U ? never : T' >Exclude]: ' >Type[Property]}; interface Circle {    kind: "circle";    radius: number;} type KindlessCircle =  = { [Property in keyof Type as Exclude]: Type[Property]; }' >RemoveKindField;           type KindlessCircle = {
    radius: number;
}Try
```


You can map over arbitrary unions, not just unions of `string | number | symbol`, but unions of any type:


```
tstype  = { [E in Events as E["kind"]]: (event: E) => void; }' >EventConfigEvents extends { kind: string }> = {    [E in ' >Events as E["kind"]]: (event: E) => void;} type SquareEvent = { kind: "square", x: number, y: number };type CircleEvent = { kind: "circle", radius: number }; type  void;
    circle: (event: CircleEvent) => void;
}' style='border-bottom: solid 2px lightgrey;'>Config =  = { [E in Events as E["kind"]]: (event: E) => void; }' >EventConfig       type Config = {
    square: (event: SquareEvent) => void;
    circle: (event: CircleEvent) => void;
}Try
```


### Further Exploration


Mapped types work well with other features in this type manipulation section, for example here is [a mapped type using a conditional type](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) which returns either a `true` or `false` depending on whether an object has the property `pii` set to the literal `true`:


```
tstype  = { [Property in keyof Type]: Type[Property] extends {
    pii: true;
} ? true : false; }' >ExtractPIIType> = {  [Property in keyof ' >Type]: ' >Type[Property] extends { pii: true } ? true : false;}; type DBFields = {  id: { format: "incrementing" };  name: { type: string; pii: true };}; type ObjectsNeedingGDPRDeletion =  = { [Property in keyof Type]: Type[Property] extends {
    pii: true;
} ? true : false; }' >ExtractPII;                 type ObjectsNeedingGDPRDeletion = {
    id: false;
    name: true;
}Try
```