---
sourceUrl: "https://www.typescriptlang.org/docs/handbook/variable-declarations.html"
fetchedAt: "2026-04-19T23:34:52.692Z"
language: "TypeScript"
title: "Variable Declarations"
---
# Variable Declarations

`let` and `const` are two relatively new concepts for variable declarations in JavaScript.
[As we mentioned earlier](https://www.typescriptlang.org/docs/handbook/basic-types.html#a-note-about-let), `let` is similar to `var` in some respects, but allows users to avoid some of the common “gotchas” that users run into in JavaScript.


`const` is an augmentation of `let` in that it prevents re-assignment to a variable.


With TypeScript being an extension of JavaScript, the language naturally supports `let` and `const`.
Here we’ll elaborate more on these new declarations and why they’re preferable to `var`.


If you’ve used JavaScript offhandedly, the next section might be a good way to refresh your memory.
If you’re intimately familiar with all the quirks of `var` declarations in JavaScript, you might find it easier to skip ahead.


## var declarations


Declaring a variable in JavaScript has always traditionally been done with the `var` keyword.


```
tsvar a = 10;
```


As you might’ve figured out, we just declared a variable named `a` with the value `10`.


We can also declare a variable inside of a function:


```
tsfunction f() {  var message = "Hello, world!";  return message;}
```


and we can also access those same variables within other functions:


```
tsfunction f() {  var a = 10;  return function g() {    var b = a + 1;    return b;  };}var g = f();g(); // returns '11'
```


In this above example, `g` captured the variable `a` declared in `f`.
At any point that `g` gets called, the value of `a` will be tied to the value of `a` in `f`.
Even if `g` is called once `f` is done running, it will be able to access and modify `a`.


```
tsfunction f() {  var a = 1;  a = 2;  var b = g();  a = 3;  return b;  function g() {    return a;  }}f(); // returns '2'
```


### Scoping rules


`var` declarations have some odd scoping rules for those used to other languages.
Take the following example:


```
tsfunction f(shouldInitialize: boolean) {  if (shouldInitialize) {    var x = 10;  }  return x;}f(true); // returns '10'f(false); // returns 'undefined'
```


Some readers might do a double-take at this example.
The variable `x` was declared *within the `if` block*, and yet we were able to access it from outside that block.
That’s because `var` declarations are accessible anywhere within their containing function, module, namespace, or global scope - all which we’ll go over later on - regardless of the containing block.
Some people call this *`var`-scoping* or *function-scoping*.
Parameters are also function scoped.


These scoping rules can cause several types of mistakes.
One problem they exacerbate is the fact that it is not an error to declare the same variable multiple times:


```
tsfunction sumMatrix(matrix: number[][]) {  var sum = 0;  for (var i = 0; i  The snippet above is an example of type inference, explained earlier in the handbook.


Then, you need to remember to give a default for optional properties on the destructured property instead of the main initializer.
Remember that `C` was defined with `b` optional:


```
tsfunction f({ a, b = 0 } = { a: "" }): void {  // ...}f({ a: "yes" }); // ok, default b = 0f(); // ok, default to { a: "" }, which then defaults b = 0f({}); // error, 'a' is required if you supply an argument
```


Use destructuring with care.
As the previous example demonstrates, anything but the simplest destructuring expression is confusing.
This is especially true with deeply nested destructuring, which gets *really* hard to understand even without piling on renaming, default values, and type annotations.
Try to keep destructuring expressions small and simple.
You can always write the assignments that destructuring would generate yourself.


## Spread


The spread operator is the opposite of destructuring.
It allows you to spread an array into another array, or an object into another object.
For example:


```
tslet first = [1, 2];let second = [3, 4];let bothPlus = [0, ...first, ...second, 5];
```


This gives bothPlus the value `[0, 1, 2, 3, 4, 5]`.
Spreading creates a shallow copy of `first` and `second`.
They are not changed by the spread.


You can also spread objects:


```
tslet defaults = { food: "spicy", price: "$$", ambiance: "noisy" };let search = { ...defaults, food: "rich" };
```


Now `search` is `{ food: "rich", price: "$$", ambiance: "noisy" }`.
Object spreading is more complex than array spreading.
Like array spreading, it proceeds from left-to-right, but the result is still an object.
This means that properties that come later in the spread object overwrite properties that come earlier.
So if we modify the previous example to spread at the end:


```
tslet defaults = { food: "spicy", price: "$$", ambiance: "noisy" };let search = { food: "rich", ...defaults };
```


Then the `food` property in `defaults` overwrites `food: "rich"`, which is not what we want in this case.


Object spread also has a couple of other surprising limits.
First, it only includes an objects’
[own, enumerable properties](https://developer.mozilla.org/docs/Web/JavaScript/Enumerability_and_ownership_of_properties).
Basically, that means you lose methods when you spread instances of an object:


```
tsclass C {  p = 12;  m() {}}let c = new C();let clone = { ...c };clone.p; // okclone.m(); // error!
```


Second, the TypeScript compiler doesn’t allow spreads of type parameters from generic functions.
That feature is expected in future versions of the language.


## using declarations


`using` declarations are an upcoming feature for JavaScript that are part of the
[Stage 3 Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) proposal. A
`using` declaration is much like a `const` declaration, except that it couples the *lifetime* of the value bound to the
declaration with the *scope* of the variable.


When control exits the block containing a `using` declaration, the `[Symbol.dispose]()` method of the
declared value is executed, which allows that value to perform cleanup:


```
tsfunction f() {  using x = new C();  doSomethingWith(x);} // `x[Symbol.dispose]()` is called
```


At runtime, this has an effect *roughly* equivalent to the following:


```
tsfunction f() {  const x = new C();  try {    doSomethingWith(x);  }  finally {    x[Symbol.dispose]();  }}
```


`using` declarations are extremely useful for avoiding memory leaks when working with JavaScript objects that hold on to
native references like file handles


```
ts{  using file = await openFile();  file.write(text);  doSomethingThatMayThrow();} // `file` is disposed, even if an error is thrown
```


or scoped operations like tracing


```
tsfunction f() {  using activity = new TraceActivity("f"); // traces entry into function  // ...} // traces exit of function
```


Unlike `var`, `let`, and `const`, `using` declarations do not support destructuring.


### null and undefined


It’s important to note that the value can be `null` or `undefined`, in which case nothing is disposed at the end of the
block:


```
ts{  using x = b ? new C() : null;  // ...}
```


which is *roughly* equivalent to:


```
ts{  const x = b ? new C() : null;  try {    // ...  }  finally {    x?.[Symbol.dispose]();  }}
```


This allows you to conditionally acquire resources when declaring a `using` declaration without the need for complex
branching or repetition.


### Defining a disposable resource


You can indicate the classes or objects you produce are disposable by implementing the `Disposable` interface:


```
ts// from the default lib:interface Disposable {  [Symbol.dispose](): void;}// usage:class TraceActivity implements Disposable {  readonly name: string;  constructor(name: string) {    this.name = name;    console.log(`Entering: ${name}`);  }  [Symbol.dispose](): void {    console.log(`Exiting: ${name}`);  }}function f() {  using _activity = new TraceActivity("f");  console.log("Hello world!");}f();// prints://   Entering: f//   Hello world!//   Exiting: f
```


## await using declarations


Some resources or operations may have cleanup that needs to be performed asynchronously. To accommodate this, the
[Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) proposal also introduces
the `await using` declaration:


```
tsasync function f() {  await using x = new C();} // `await x[Symbol.asyncDispose]()` is invoked
```


An `await using` declaration invokes, and *awaits*, its value’s `[Symbol.asyncDispose]()` method as control leaves the
containing block. This allows for asynchronous cleanup, such as a database transaction performing a rollback or commit,
or a file stream flushing any pending writes to storage before it is closed.


As with `await`, `await using` can only be used in an `async` function or method, or at the top level of a module.


### Defining an asynchronously disposable resource


Just as `using` relies on objects that are `Disposable`, an `await using` relies on objects that are `AsyncDisposable`:


```
ts// from the default lib:interface AsyncDisposable {  [Symbol.asyncDispose]: PromiseLike;}// usage:class DatabaseTransaction implements AsyncDisposable {  public success = false;  private db: Database | undefined;  private constructor(db: Database) {    this.db = db;  }  static async create(db: Database) {    await db.execAsync("BEGIN TRANSACTION");    return new DatabaseTransaction(db);  }  async [Symbol.asyncDispose]() {    if (this.db) {      const db = this.db:      this.db = undefined;      if (this.success) {        await db.execAsync("COMMIT TRANSACTION");      }      else {        await db.execAsync("ROLLBACK TRANSACTION");      }    }  }}async function transfer(db: Database, account1: Account, account2: Account, amount: number) {  using tx = await DatabaseTransaction.create(db);  if (await debitAccount(db, account1, amount)) {    await creditAccount(db, account2, amount);  }  // if an exception is thrown before this line, the transaction will roll back  tx.success = true;  // now the transaction will commit}
```


### await using vs await


The `await` keyword that is part of the `await using` declaration only indicates that the *disposal* of the resource is
`await`-ed. It does *not* `await` the value itself:


```
ts{  await using x = getResourceSynchronously();} // performs `await x[Symbol.asyncDispose]()`{  await using y = await getResourceAsynchronously();} // performs `await y[Symbol.asyncDispose]()`
```


### await using and return


It’s important to note that there is a small caveat with this behavior if you are using an `await using` declaration in
an `async` function that returns a `Promise` without first `await`-ing it:


```
tsfunction g() {  return Promise.reject("error!");}async function f() {  await using x = new C();  return g(); // missing an `await`}
```


Because the returned promise isn’t `await`-ed, it’s possible that the JavaScript runtime may report an unhandled
rejection since execution pauses while `await`-ing the asynchronous disposal of `x`, without having subscribed to the
returned promise. This is not a problem that is unique to `await using`, however, as this can also occur in an `async`
function that uses `try..finally`:


```
tsasync function f() {  try {    return g(); // also reports an unhandled rejection  }  finally {    await somethingElse();  }}
```


To avoid this situation, it is recommended that you `await` your return value if it may be a `Promise`:


```
tsasync function f() {  await using x = new C();  return await g();}
```


## using and await using in for and for..of statements


Both `using` and `await using` can be used in a `for` statement:


```
tsfor (using x = getReader(); !x.eof; x.next()) {  // ...}
```


In this case, the lifetime of `x` is scoped to the entire `for` statement and is only disposed when control leaves the
loop due to `break`, `return`, `throw`, or when the loop condition is false.


In addition to `for` statements, both declarations can also be used in `for..of` statements:


```
tsfunction * g() {  yield createResource1();  yield createResource2();}for (using x of g()) {  // ...}
```


Here, `x` is disposed at the end of *each iteration of the loop*, and is then reinitialized with the next value. This is
especially useful when consuming resources produced one at a time by a generator.


## using and await using in older runtimes


`using` and `await using` declarations can be used when targeting older ECMAScript editions as long as you are using
a compatible polyfill for `Symbol.dispose`/`Symbol.asyncDispose`, such as the one provided by default in recent
editions of NodeJS.