---
sourceUrl: "https://www.typescriptlang.org/docs/handbook/type-inference.html"
fetchedAt: "2026-04-19T23:34:52.699Z"
language: "TypeScript"
title: "Type Inference"
---
# Type Inference

In TypeScript, there are several places where type inference is used to provide type information when there is no explicit type annotation. For example, in this code


```
tslet x = 3;   let x: numberTry
```


The type of the `x` variable is inferred to be `number`.
This kind of inference takes place when initializing variables and members, setting parameter default values, and determining function return types.


In most cases, type inference is straightforward.
In the following sections, we’ll explore some of the nuances in how types are inferred.


## Best common type


When a type inference is made from several expressions, the types of those expressions are used to calculate a “best common type”. For example,


```
tslet x = [0, 1, null];   let x: (number | null)[]Try
```


To infer the type of `x` in the example above, we must consider the type of each array element.
Here we are given two choices for the type of the array: `number` and `null`.
The best common type algorithm considers each candidate type, and picks the type that is compatible with all the other candidates.


Because the best common type has to be chosen from the provided candidate types, there are some cases where types share a common structure, but no one type is the super type of all candidate types. For example:


```
tslet zoo = [new Rhino(), new Elephant(), new Snake()];    let zoo: (Rhino | Elephant | Snake)[]Try
```


Ideally, we may want `zoo` to be inferred as an `Animal[]`, but because there is no object that is strictly of type `Animal` in the array, we make no inference about the array element type.
To correct this, explicitly provide the type when no one type is a super type of all other candidates:


```
tslet zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];    let zoo: Animal[]Try
```


When no best common type is found, the resulting inference is the union array type, `(Rhino | Elephant | Snake)[]`.


## Contextual Typing


Type inference also works in “the other direction” in some cases in TypeScript.
This is known as “contextual typing”. Contextual typing occurs when the type of an expression is implied by its location. For example:


```
tswindow. any) & ((this: Window, ev: MouseEvent) => any)) | null' >onmousedown = function (mouseEvent) {  console.log(mouseEvent.button);  console.log(mouseEvent.kangaroo);Property 'kangaroo' does not exist on type 'MouseEvent'.2339Property 'kangaroo' does not exist on type 'MouseEvent'.};Try
```


Here, the TypeScript type checker used the type of the `Window.onmousedown` function to infer the type of the function expression on the right hand side of the assignment.
When it did so, it was able to infer the [type](https://developer.mozilla.org/docs/Web/API/MouseEvent) of the `mouseEvent` parameter, which does contain a `button` property, but not a `kangaroo` property.


This works because window already has `onmousedown` declared in its type:


```
ts// Declares there is a global variable called 'window'declare var window: Window & typeof globalThis;// Which is declared as (simplified):interface Window extends GlobalEventHandlers {  // ...}// Which defines a lot of known handler eventsinterface GlobalEventHandlers {  onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;  // ...}
```


TypeScript is smart enough to infer types in other contexts as well:


```
tswindow. any) & ((this: Window, ev: Event) => any)) | null' >onscroll = function (uiEvent) {  console.log(uiEvent.button);Property 'button' does not exist on type 'Event'.2339Property 'button' does not exist on type 'Event'.};Try
```


Based on the fact that the above function is being assigned to `Window.onscroll`, TypeScript knows that `uiEvent` is a [UIEvent](https://developer.mozilla.org/docs/Web/API/UIEvent), and not a [MouseEvent](https://developer.mozilla.org/docs/Web/API/MouseEvent) like the previous example. `UIEvent` objects contain no `button` property, and so TypeScript will throw an error.


If this function were not in a contextually typed position, the function’s argument would implicitly have type `any`, and no error would be issued (unless you are using the [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny) option):


```
tsconst  void' >handler = function (uiEvent) {  console.log(uiEvent.button); //  any)) | null' >onscroll = function (uiEvent: any) {  console.log(uiEvent.button); //