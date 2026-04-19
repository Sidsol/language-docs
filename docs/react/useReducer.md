---
sourceUrl: https://react.dev/reference/react/useReducer
fetchedAt: 2026-04-19T00:00:00Z
language: react
---

# useReducer

`useReducer` is a React Hook that lets you add a [reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer) to your component.

```javascript
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

## Reference

### `useReducer(reducer, initialArg, init?)`

Call `useReducer` at the top level of your component to manage its state with a [reducer.](https://react.dev/learn/extracting-state-logic-into-a-reducer)

```javascript
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

#### Parameters

- `reducer`: The reducer function that specifies how the state gets updated. It must be pure, should take the state and action as arguments, and should return the next state. State and action can be of any types.
- `initialArg`: The value from which the initial state is calculated. It can be a value of any type. How the initial state is calculated from it depends on the next `init` argument.
- _optional_ `init`: The initializer function that should return the initial state. If it's not specified, the initial state is set to `initialArg`. Otherwise, the initial state is set to the result of calling `init(initialArg)`.

#### Returns

`useReducer` returns an array with exactly two values:

1. The current state. During the first render, it's set to `init(initialArg)` or `initialArg` (if there's no `init`).
2. The [`dispatch` function](#dispatch-function) that lets you update the state to a different value and trigger a re-render.

#### Caveats

- `useReducer` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions.
- The `dispatch` function has a stable identity, so you will often see it omitted from Effect dependencies.
- In Strict Mode, React will call your reducer and initializer twice in order to help you find accidental impurities.

### `dispatch` function

The `dispatch` function returned by `useReducer` lets you update the state to a different value and trigger a re-render. You need to pass the action as the only argument to the `dispatch` function:

```javascript
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React will set the next state to the result of calling the `reducer` function you've provided with the current `state` and the action you've passed to `dispatch`.

#### Parameters

- `action`: The action performed by the user. It can be a value of any type. By convention, an action is usually an object with a `type` property identifying it and, optionally, other properties with additional information.

#### Returns

`dispatch` functions do not have a return value.

#### Caveats

- The `dispatch` function **only updates the state variable for the _next_ render**. If you read the state variable after calling the `dispatch` function, you will still get the old value.
- If the new value you provide is identical to the current `state`, as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison, React will skip re-rendering the component and its children.
- React [batches state updates.](https://react.dev/learn/queueing-a-series-of-state-updates) It updates the screen **after all the event handlers have run** and have called their `set` functions.

## Usage

### Adding a reducer to a component

Call `useReducer` at the top level of your component to manage state with a [reducer.](https://react.dev/learn/extracting-state-logic-into-a-reducer)

```javascript
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

`useReducer` is very similar to [`useState`](https://react.dev/reference/react/useState), but it lets you move the state update logic from event handlers into a single function outside of your component. Read more about [choosing between `useState` and `useReducer`.](https://react.dev/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

### Writing the reducer function

A reducer function is declared like this:

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Actions can have any shape. By convention, it's common to pass objects with a `type` property identifying the action. It should include the minimal necessary information that the reducer needs to compute the next state.

> **Pitfall:** State is read-only. Don't modify any objects or arrays in state:
>
> ```javascript
> // 🚩 Don't mutate an object in state like this:
> state.age = state.age + 1;
> return state;
> ```
>
> Instead, always return new objects from your reducer:
>
> ```javascript
> // ✅ Instead, return a new object
> return {
>   ...state,
>   age: state.age + 1
> };
> ```

### Avoiding recreating the initial state

React saves the initial state once and ignores it on the next renders. To avoid recreating the initial state on every render, you may pass an initializer function as the third argument:

```javascript
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

Notice that you're passing `createInitialState`, which is the _function itself_, and not `createInitialState()`, which is the result of calling it.

## Troubleshooting

### I've dispatched an action, but logging gives me the old state value

Calling the `dispatch` function **does not change state in the running code**:

```javascript
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Request a re-render with 43
  console.log(state.age);  // Still 42!
}
```

This is because [states behaves like a snapshot.](https://react.dev/learn/state-as-a-snapshot)

### I've dispatched an action, but the screen doesn't update

React will ignore your update if the next state is equal to the previous state, as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. This usually happens when you change an object or an array in state directly. You need to ensure that you're always [updating objects in state](https://react.dev/learn/updating-objects-in-state) and [updating arrays in state](https://react.dev/learn/updating-arrays-in-state) instead of mutating them.

### A part of my reducer state becomes undefined after dispatching

Make sure that every `case` branch **copies all of the existing fields** when returning the new state:

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Don't forget this!
        age: state.age + 1
      };
    }
    // ...
```

### My entire reducer state becomes undefined after dispatching

If your state unexpectedly becomes `undefined`, you're likely forgetting to `return` state in one of the cases, or your action type doesn't match any of the `case` statements. To find why, throw an error outside the `switch`:

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

### I'm getting an error: "Too many re-renders"

Typically, this means that you're unconditionally dispatching an action _during render_. Very often, this is caused by a mistake in specifying an event handler:

```javascript
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

### My reducer or initializer function runs twice

In [Strict Mode](https://react.dev/reference/react/StrictMode), React will call your reducer and initializer functions twice. This is **development-only** behavior that helps you [keep components pure.](https://react.dev/learn/keeping-components-pure)
