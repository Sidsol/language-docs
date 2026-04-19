---
sourceUrl: "https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html"
fetchedAt: "2026-04-19T23:34:50.776Z"
language: "TypeScript"
title: "TypeScript for the New Programmer"
---
# TypeScript for the New Programmer

Congratulations on choosing TypeScript as one of your first languages — you’re already making good decisions!


You’ve probably already heard that TypeScript is a “flavor” or “variant” of JavaScript.
The relationship between TypeScript (TS) and JavaScript (JS) is rather unique among modern programming languages, so learning more about this relationship will help you understand how TypeScript adds to JavaScript.


## What is JavaScript? A Brief History


JavaScript (also known as ECMAScript) started its life as a simple scripting language for browsers.
At the time it was invented, it was expected to be used for short snippets of code embedded in a web page — writing more than a few dozen lines of code would have been somewhat unusual.
Due to this, early web browsers executed such code pretty slowly.
Over time, though, JS became more and more popular, and web developers started using it to create interactive experiences.


Web browser developers responded to this increased JS usage by optimizing their execution engines (dynamic compilation) and extending what could be done with it (adding APIs), which in turn made web developers use it even more.
On modern websites, your browser is frequently running applications that span hundreds of thousands of lines of code.
This is the long and gradual growth of “the web”, starting as a simple network of static pages, and evolving into a platform for rich *applications* of all kinds.


More than this, JS has become popular enough to be used outside the context of browsers, such as implementing JS servers using node.js.
The “run anywhere” nature of JS makes it an attractive choice for cross-platform development.
There are many developers these days that use *only* JavaScript to program their entire stack!


To summarize, we have a language that was designed for quick uses, and then grew to a full-fledged tool to write applications with millions of lines.
Every language has its own *quirks* — oddities and surprises, and JavaScript’s humble beginning makes it have *many* of these. Some examples:


- JavaScript’s equality operator (`==`) *coerces* its operands, leading to unexpected behavior:

```
jsif ("" == 0) {  // It is! But why??}if (1
#### Erased Types


Roughly speaking, once TypeScript’s compiler is done with checking your code, it *erases* the types to produce the resulting “compiled” code.
This means that once your code is compiled, the resulting plain JS code has no type information.


This also means that TypeScript never changes the *behavior* of your program based on the types it inferred.
The bottom line is that while you might see type errors during compilation, the type system itself has no bearing on how your program works when it runs.


Finally, TypeScript doesn’t provide any additional runtime libraries.
Your programs will use the same standard library (or external libraries) as JavaScript programs, so there’s no additional TypeScript-specific framework to learn.


## Learning JavaScript and TypeScript


We frequently see the question “Should I learn JavaScript or TypeScript?“.


The answer is that you can’t learn TypeScript without learning JavaScript!
TypeScript shares syntax and runtime behavior with JavaScript, so anything you learn about JavaScript is helping you learn TypeScript at the same time.


There are many, many resources available for programmers to learn JavaScript; you should *not* ignore these resources if you’re writing TypeScript.
For example, there are about 20 times more StackOverflow questions tagged `javascript` than `typescript`, but *all* of the `javascript` questions also apply to TypeScript.


If you find yourself searching for something like “how to sort a list in TypeScript”, remember: **TypeScript is JavaScript’s runtime with a compile-time type checker**.
The way you sort a list in TypeScript is the same way you do so in JavaScript.
If you find a resource that uses TypeScript directly, that’s great too, but don’t limit yourself to thinking you need TypeScript-specific answers for everyday questions about how to accomplish runtime tasks.


## Next Steps


This was a brief overview of the syntax and tools used in everyday TypeScript. From here, you can:


- Learn some of the JavaScript fundamentals, we recommend either:

[Microsoft’s JavaScript Resources](https://developer.microsoft.com/javascript/) or

- [JavaScript guide at the Mozilla Web Docs](https://developer.mozilla.org/docs/Web/JavaScript/Guide)


- Continue to [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

- Read the full Handbook [from start to finish](https://www.typescriptlang.org/docs/handbook/intro.html)

- Explore the [Playground examples](https://www.typescriptlang.org/play#show-examples)