---
sourceUrl: https://react.dev/reference/react/useTransition
fetchedAt: 2026-04-19T00:00:00Z
language: react
---

# useTransition

`useTransition` is a React Hook that lets you render a part of the UI in the background.

```javascript
const [isPending, startTransition] = useTransition()
```

## Reference

### `useTransition()`

Call `useTransition` at the top level of your component to mark some state updates as Transitions.

```javascript
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

#### Parameters

`useTransition` does not take any parameters.

#### Returns

`useTransition` returns an array with exactly two items:

1. The `isPending` flag that tells you whether there is a pending Transition.
2. The [`startTransition` function](#starttransitionaction) that lets you mark updates as a Transition.

### `startTransition(action)`

The `startTransition` function returned by `useTransition` lets you mark an update as a Transition.

```javascript
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

> **Note:** Functions called in `startTransition` are called "Actions". By convention, any callback called inside `startTransition` (such as a callback prop) should be named `action` or include the "Action" suffix.

#### Parameters

- `action`: A function that updates some state by calling one or more [`set` functions](https://react.dev/reference/react/useState#setstate). React calls `action` immediately with no parameters and marks all state updates scheduled synchronously during the `action` function call as Transitions. Any async calls that are awaited in the `action` will be included in the Transition, but currently require wrapping any `set` functions after the `await` in an additional `startTransition`.

#### Returns

`startTransition` does not return anything.

#### Caveats

- `useTransition` is a Hook, so it can only be called inside components or custom Hooks. If you need to start a Transition somewhere else (for example, from a data library), call the standalone [`startTransition`](https://react.dev/reference/react/startTransition) instead.
- You can wrap an update into a Transition only if you have access to the `set` function of that state. If you want to start a Transition in response to some prop or a custom Hook value, try [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) instead.
- The function you pass to `startTransition` is called immediately, marking all state updates that happen while it executes as Transitions.
- You must wrap any state updates after any async requests in another `startTransition` to mark them as Transitions. This is a known limitation that will be fixed in the future.
- The `startTransition` function has a stable identity, so you will often see it omitted from Effect dependencies.
- A state update marked as a Transition will be interrupted by other state updates.
- Transition updates can't be used to control text inputs.
- If there are multiple ongoing Transitions, React currently batches them together.

## Usage

### Perform non-blocking updates with Actions

Call `useTransition` at the top of your component to create Actions, and access the pending state:

```javascript
import { useState, useTransition } from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

To start a Transition, pass a function to `startTransition` like this:

```javascript
import { useState, useTransition } from 'react';
import { updateQuantity } from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ...
}
```

The function passed to `startTransition` is called the "Action". You can update state and (optionally) perform side effects within an Action, and the work will be done in the background without blocking user interactions on the page.

### Exposing `action` prop from components

You can expose an `action` prop from a component to allow a parent to call an Action:

```javascript
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={async () => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

### Displaying a pending visual state

You can use the `isPending` boolean value returned by `useTransition` to indicate to the user that a Transition is in progress:

```javascript
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

### Preventing unwanted loading indicators

If you add `useTransition` to a component that triggers a Suspense boundary, you can prevent unwanted loading indicators. The Transition will "wait" before showing the loading state, displaying the previous content instead.

### Building a Suspense-enabled router

If you're building a React framework or a router, we recommend marking page navigations as Transitions:

```javascript
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

This is recommended for three reasons:

- Transitions are interruptible, which lets the user click away without waiting for the re-render to complete.
- Transitions prevent unwanted loading indicators, which lets the user avoid jarring jumps on navigation.
- Transitions wait for all pending actions which lets the user wait for side effects to complete before the new page is shown.

### Displaying an error to users with an error boundary

If a function passed to `startTransition` throws an error, you can display an error to your user with an [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

## Troubleshooting

### Updating an input in a Transition doesn't work

You can't use a Transition for a state variable that controls an input. Transitions are non-blocking, but updating an input in response to the change event should happen synchronously.

Two options:
1. Declare two separate state variables: one for the input state (which always updates synchronously), and one that you will update in a Transition.
2. Have one state variable, and add [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue) which will "lag behind" the real value.

### React doesn't treat my state update as a Transition

Make sure that it happens _during_ the `startTransition` call:

```javascript
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

The function you pass to `startTransition` must be synchronous.

### React doesn't treat my state update after `await` as a Transition

You must wrap state updates after each `await` in a `startTransition` call:

```javascript
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Using startTransition *after* await
  startTransition(() => {
    setPage('/about');
  });
});
```

This is a JavaScript limitation due to React losing the scope of the async context.

### I want to call `useTransition` from outside a component

You can't call `useTransition` outside a component because it's a Hook. In this case, use the standalone [`startTransition`](https://react.dev/reference/react/startTransition) method instead. It works the same way, but it doesn't provide the `isPending` indicator.

### The function I pass to `startTransition` executes immediately

The function you pass to `startTransition` does not get delayed. Unlike with the browser `setTimeout`, it does not run the callback later. React executes your function immediately, but any state updates scheduled while it is running are marked as Transitions.

### My state updates in Transitions are out of order

If you `await` inside `startTransition`, it's possible for the previous requests to finish after later requests causing the quantity to update out of order.

For common use cases, React provides higher-level abstractions like [`useActionState`](https://react.dev/reference/react/useActionState) and [`<form>` actions](https://react.dev/reference/react-dom/components/form) that handle ordering for you. For advanced use cases, you'll need to implement your own queuing and abort logic.
