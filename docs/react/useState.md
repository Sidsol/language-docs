---
sourceUrl: https://react.dev/reference/react/useState
fetchedAt: 2026-04-19T00:00:00Z
language: react
---

# useState

`useState` is a React Hook that lets you add a [state variable](https://react.dev/learn/state-a-components-memory) to your component.

```javascript
const [state, setState] = useState(initialState)
```

## Reference

### `useState(initialState)`

Call `useState` at the top level of your component to declare a [state variable.](https://react.dev/learn/state-a-components-memory)

```javascript
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

The convention is to name state variables like `[something, setSomething]` using [array destructuring.](https://javascript.info/destructuring-assignment)

#### Parameters

- `initialState`: The value you want the state to be initially. It can be a value of any type, but there is a special behavior for functions. This argument is ignored after the initial render.
  - If you pass a function as `initialState`, it will be treated as an _initializer function_. It should be pure, should take no arguments, and should return a value of any type. React will call your initializer function when initializing the component, and store its return value as the initial state.

#### Returns

`useState` returns an array with exactly two values:

1. The current state. During the first render, it will match the `initialState` you have passed.
2. The `set` function that lets you update the state to a different value and trigger a re-render.

#### Caveats

- `useState` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
- In Strict Mode, React will call your initializer function twice in order to help you find accidental impurities. This is development-only behavior and does not affect production.

### `set` functions, like `setSomething(nextState)`

The `set` function returned by `useState` lets you update the state to a different value and trigger a re-render. You can pass the next state directly, or a function that calculates it from the previous state:

```javascript
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Parameters

- `nextState`: The value that you want the state to be. It can be a value of any type, but there is a special behavior for functions.
  - If you pass a function as `nextState`, it will be treated as an _updater function_. It must be pure, should take the pending state as its only argument, and should return the next state.

#### Returns

`set` functions do not have a return value.

#### Caveats

- The `set` function **only updates the state variable for the _next_ render**. If you read the state variable after calling the `set` function, you will still get the old value.
- If the new value you provide is identical to the current `state`, as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison, React will skip re-rendering the component and its children.
- React [batches state updates.](https://react.dev/learn/queueing-a-series-of-state-updates) It updates the screen **after all the event handlers have run** and have called their `set` functions.
- The `set` function has a stable identity, so you will often see it omitted from Effect dependencies.
- Calling the `set` function _during rendering_ is only allowed from within the currently rendering component.

## Usage

### Adding state to a component

Call `useState` at the top level of your component to declare one or more [state variables.](https://react.dev/learn/state-a-components-memory)

```javascript
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

`useState` returns an array with exactly two items:

1. The **current state** of this state variable, initially set to the initial state you provided.
2. The **`set` function** that lets you change it to any other value in response to interaction.

To update what's on the screen, call the `set` function with some next state:

```javascript
function handleClick() {
  setName('Robin');
}
```

React will store the next state, render your component again with the new values, and update the UI.

> **Pitfall:** Calling the `set` function does **not** change the current state in the already executing code. It only affects what `useState` will return starting from the _next_ render.

### Updating state based on the previous state

Suppose the `age` is `42`. This handler calls `setAge(age + 1)` three times:

```javascript
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

However, after one click, `age` will only be `43` rather than `45`! This is because calling the `set` function [does not update](https://react.dev/learn/state-as-a-snapshot) the `age` state variable in the already running code.

To solve this problem, you may pass an **updater function** to `setAge` instead of the next state:

```javascript
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Here, `a => a + 1` is your updater function. It takes the pending state and calculates the next state from it.

### Updating objects and arrays in state

You can put objects and arrays into state. In React, state is considered read-only, so you should **replace it rather than mutate** your existing objects. For example, if you have a `form` object in state, don't mutate it:

```javascript
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

Instead, replace the whole object by creating a new one:

```javascript
// ✅ Replace state with a new object
setForm({
  ...form,
  firstName: 'Taylor'
});
```

Read [updating objects in state](https://react.dev/learn/updating-objects-in-state) and [updating arrays in state](https://react.dev/learn/updating-arrays-in-state) to learn more.

### Avoiding recreating the initial state

React saves the initial state once and ignores it on the next renders.

```javascript
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Although the result of `createInitialTodos()` is only used for the initial render, you're still calling this function on every render. This can be wasteful if it's creating large arrays or performing expensive calculations.

To solve this, you may **pass it as an initializer function** to `useState` instead:

```javascript
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Notice that you're passing `createInitialTodos`, which is the _function itself_, and not `createInitialTodos()`, which is the result of calling it. If you pass a function to `useState`, React will only call it during initialization.

### Resetting state with a key

You can reset a component's state by passing a different `key` to a component. When the `key` changes, React re-creates the component (and all of its children) from scratch, so its state gets reset.

Read [preserving and resetting state](https://react.dev/learn/preserving-and-resetting-state) to learn more.

### Storing information from previous renders

Usually, you will update state in event handlers. However, in rare cases you might want to adjust state in response to rendering — for example, you might want to change a state variable when a prop changes.

In most cases, you don't need this:

- If the value you need can be computed entirely from the current props or other state, [remove that redundant state altogether.](https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state)
- If you want to reset the entire component tree's state, pass a different `key` to your component.
- If you can, update all the relevant state in the event handlers.

## Troubleshooting

### I've updated the state, but logging gives me the old value

Calling the `set` function **does not change state in the running code**:

```javascript
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!

  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

This is because [states behaves like a snapshot.](https://react.dev/learn/state-as-a-snapshot) Updating state requests another render with the new state value, but does not affect the `count` JavaScript variable in your already-running event handler.

### I've updated the state, but the screen doesn't update

React will ignore your update if the next state is equal to the previous state, as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. This usually happens when you change an object or an array in state directly:

```javascript
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

You need to ensure that you're always **replacing** objects and arrays in state instead of **mutating** them:

```javascript
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

### I'm getting an error: "Too many re-renders"

You might get an error that says: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Typically, this means that you're unconditionally setting state _during render_. Very often, this is caused by a mistake in specifying an event handler:

```javascript
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

### My initializer or updater function runs twice

In [Strict Mode](https://react.dev/reference/react/StrictMode), React will call some of your functions twice instead of once. This is expected and shouldn't break your code. This **development-only** behavior helps you [keep components pure.](https://react.dev/learn/keeping-components-pure)

### I'm trying to set state to a function, but it gets called instead

You can't put a function into state like this:

```javascript
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Because you're passing a function, React assumes that `someFunction` is an initializer function, and that `someOtherFunction` is an updater function, so it tries to call them and store the result. To actually _store_ a function, you have to put `() =>` before them in both cases:

```javascript
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
