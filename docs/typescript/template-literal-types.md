---
sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html"
fetchedAt: "2026-04-19T23:34:51.709Z"
language: "TypeScript"
title: "Template Literal Types"
---
# Template Literal Types

Template literal types build on [string literal types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types), and have the ability to expand into many strings via unions.


They have the same syntax as [template literal strings in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), but are used in type positions.
When used with concrete literal types, a template literal produces a new string literal type by concatenating the contents.


```
tstype World = "world"; type Greeting = `hello ${World}`;        type Greeting = "hello world"Try
```


When a union is used in the interpolated position, the type is the set of every possible string literal that could be represented by each union member:


```
tstype EmailLocaleIDs = "welcome_email" | "email_heading";type FooterLocaleIDs = "footer_title" | "footer_sendoff"; type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;          type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"Try
```


For each interpolated position in the template literal, the unions are cross multiplied:


```
tstype AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;type Lang = "en" | "ja" | "pt"; type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;            type LocaleMessageIDs = "en_welcome_email_id" | "en_email_heading_id" | "en_footer_title_id" | "en_footer_sendoff_id" | "ja_welcome_email_id" | "ja_email_heading_id" | "ja_footer_title_id" | "ja_footer_sendoff_id" | "pt_welcome_email_id" | "pt_email_heading_id" | "pt_footer_title_id" | "pt_footer_sendoff_id"Try
```


We generally recommend that people use ahead-of-time generation for large string unions, but this is useful in smaller cases.


### String Unions in Types


The power in template literals comes when defining a new string based on information inside a type.


Consider the case where a function (`makeWatchedObject`) adds a new function
called `on()` to a passed object.  In JavaScript, its call might look like:
`makeWatchedObject(baseObject)`. We can imagine the base object as looking
like:


```
tsconst passedObject = {  firstName: "Saoirse",  lastName: "Ronan",  age: 26,};Try
```


The `on` function that will be added to the base object expects two arguments, an `eventName` (a `string`) and a `callback` (a `function`).


The `eventName` should be of the form `attributeInThePassedObject + "Changed"`; thus, `firstNameChanged` as derived from the attribute `firstName` in the base object.


The `callback` function, when called:


- Should be passed a value of the type associated with the name `attributeInThePassedObject`; thus, since `firstName` is typed as `string`, the callback for the `firstNameChanged` event expects a `string` to be passed to it at call time. Similarly events associated with `age` should expect to be called with a `number` argument

- Should have `void` return type (for simplicity of demonstration)


The naive function signature of `on()` might thus be: `on(eventName: string, callback: (newValue: any) => void)`. However, in the preceding description, we identified important type constraints that we’d like to document in our code. Template Literal types let us bring these constraints into our code.


```
tsconst person = makeWatchedObject({  firstName: "Saoirse",  lastName: "Ronan",  age: 26,}); // makeWatchedObject has added `on` to the anonymous Object person.on("firstNameChanged", (newValue) => {  console.log(`firstName was changed to ${newValue}!`);});Try
```


Notice that `on` listens on the event `"firstNameChanged"`, not just `"firstName"`. Our naive specification of `on()` could be made more robust if we were to ensure that the set of eligible event names was constrained by the union of attribute names in the watched object with “Changed” added at the end. While we are comfortable with doing such a calculation in JavaScript i.e. `Object.keys(passedObject).map(x => `${x}Changed`)`, template literals *inside the type system* provide a similar approach to string manipulation:


```
tstype  = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
}' >PropEventSourceType> = {     void): void' >on(eventName: `${string & keyof ' >Type}Changed`,  void' >callback: (newValue: any) => void): void;}; /// Create a "watched object" with an `on` method/// so that you can watch for changes to properties.declare function (obj: Type): Type & PropEventSource' >makeWatchedObject' >Type>(obj: (obj: Type): Type & PropEventSource' >Type): (obj: Type): Type & PropEventSource' >Type &  = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
}' >PropEventSource' >Type>;Try
```


With this, we can build something that errors when given the wrong property:


```
tsconst ' >person = (obj: {
    firstName: string;
    lastName: string;
    age: number;
}): {
    firstName: string;
    lastName: string;
    age: number;
} & PropEventSource' >makeWatchedObject({  firstName: "Saoirse",  lastName: "Ronan",  age: 26}); ' >person. void): void' >on("firstNameChanged", () => {}); // Prevent easy human error (using the key instead of the event name)' >person. void): void' >on("firstName", () => {});Argument of type '"firstName"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.2345Argument of type '"firstName"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'. // It&apos;s typo-resistant' >person. void): void' >on("frstNameChanged", () => {});Argument of type '"frstNameChanged"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.2345Argument of type '"frstNameChanged"' is not assignable to parameter of type '"firstNameChanged" | "lastNameChanged" | "ageChanged"'.Try
```


### Inference with Template Literals


Notice that we did not benefit from all the information provided in the original passed object. Given change of a `firstName` (i.e. a `firstNameChanged` event),  we should expect that the callback will receive an argument of type `string`. Similarly, the callback for a change to `age` should receive a `number` argument. We’re naively using `any` to type the `callback`’s argument. Again, template literal types make it possible to ensure an attribute’s data type will be the same type as that attribute’s callback’s first argument.


The key insight that makes this possible is this: we can use a function with a generic such that:


- The literal used in the first argument is captured as a literal type

- That literal type can be validated as being in the union of valid attributes in the generic

- The type of the validated attribute can be looked up in the generic’s structure using Indexed Access

- This typing information can *then* be applied to ensure the argument to the
callback function is of the same type


```
tstype  = {
    on(eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void;
}' >PropEventSourceType> = {    (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void' >on void): void' >Key extends string & keyof ' >Type>        (eventName: `${(eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void' >Key}Changed`,  void' >callback: (newValue: ' >Type[(eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void' >Key]) => void): void;}; declare function (obj: Type): Type & PropEventSource' >makeWatchedObject' >Type>(obj: (obj: Type): Type & PropEventSource' >Type): (obj: Type): Type & PropEventSource' >Type &  = {
    on(eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void;
}' >PropEventSource' >Type>; const ' >person = (obj: {
    firstName: string;
    lastName: string;
    age: number;
}): {
    firstName: string;
    lastName: string;
    age: number;
} & PropEventSource' >makeWatchedObject({  firstName: "Saoirse",  lastName: "Ronan",  age: 26}); ' >person.(eventName: "firstNameChanged", callback: (newValue: string) => void): void' >on("firstNameChanged", newName => {                                (parameter) newName: string    console.log(`new name is ${newName.toUpperCase()}`);}); ' >person.(eventName: "ageChanged", callback: (newValue: number) => void): void' >on("ageChanged", newAge => {                          (parameter) newAge: number    if (newAge


Converts each character in the string to the uppercase version.


##### Example


```
tstype Greeting = "Hello, world"type ShoutyGreeting =  = intrinsic' >Uppercase           type ShoutyGreeting = "HELLO, WORLD" type  = `ID-${Uppercase}`' >ASCIICacheKeyStr extends string> = `ID-${ = intrinsic' >UppercaseStr>}`type MainID =  = `ID-${Uppercase}`' >ASCIICacheKey       type MainID = "ID-MY_APP"Try
```


### Lowercase<StringType>


Converts each character in the string to the lowercase equivalent.


##### Example


```
tstype Greeting = "Hello, world"type QuietGreeting =  = intrinsic' >Lowercase          type QuietGreeting = "hello, world" type  = `id-${Lowercase}`' >ASCIICacheKeyStr extends string> = `id-${ = intrinsic' >LowercaseStr>}`type MainID =  = `id-${Lowercase}`' >ASCIICacheKey       type MainID = "id-my_app"Try
```


### Capitalize<StringType>


Converts the first character in the string to an uppercase equivalent.


##### Example


```
tstype LowercaseGreeting = "hello, world";type Greeting =  = intrinsic' >Capitalize;        type Greeting = "Hello, world"Try
```


### Uncapitalize<StringType>


Converts the first character in the string to a lowercase equivalent.


##### Example


```
tstype UppercaseGreeting = "HELLO WORLD";type UncomfortableGreeting =  = intrinsic' >Uncapitalize;              type UncomfortableGreeting = "hELLO WORLD"Try
```


    Technical details on the intrinsic string manipulation types
    The code, as of TypeScript 4.1, for these intrinsic functions uses the JavaScript string runtime functions directly for manipulation and are not locale aware.


    `
```
function applyStringMapping(symbol: Symbol, str: string) {
    switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
        case IntrinsicTypeKind.Uppercase: return str.toUpperCase();
        case IntrinsicTypeKind.Lowercase: return str.toLowerCase();
        case IntrinsicTypeKind.Capitalize: return str.charAt(0).toUpperCase() + str.slice(1);
        case IntrinsicTypeKind.Uncapitalize: return str.charAt(0).toLowerCase() + str.slice(1);
    }
    return str;
}
```

`