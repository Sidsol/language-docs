---
sourceUrl: https://react.dev/reference/react/useEffect
fetchedAt: 2026-04-19T00:00:00Z
language: react
---

# useEffect

`useEffect` is a React Hook that lets you [synchronize a component with an external system.](https://react.dev/learn/synchronizing-with-effects)

```javascript
useEffect(setup, dependencies?)
```

## Reference

### `useEffect(setup, dependencies?)`

Call `useEffect` at the top level of your component to declare an Effect:

```javascript
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

#### Parameters

- `setup`: The function with your Effect's logic. Your setup function may also optionally return a _cleanup_ function. When your component commits, React will run your setup function. After every commit with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. After your component is removed from the DOM, React will run your cleanup function.

- _optional_ `dependencies`: The list of all reactive values referenced inside of the `setup` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. If you omit this argument, your Effect will re-run after every commit of the component.

#### Returns

`useEffect` returns `undefined`.

#### Caveats

- `useEffect` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions.
- If you're not trying to synchronize with some external system, [you probably don't need an Effect.](https://react.dev/learn/you-might-not-need-an-effect)
- When Strict Mode is on, React will run one extra development-only setup+cleanup cycle before the first real setup.
- If some of your dependencies are objects or functions defined inside the component, there is a risk that they will cause the Effect to re-run more often than needed. To fix this, remove unnecessary [object](https://react.dev/reference/react/useEffect#removing-unnecessary-object-dependencies) and [function](https://react.dev/reference/react/useEffect#removing-unnecessary-function-dependencies) dependencies.
- If your Effect wasn't caused by an interaction (like a click), React will generally let the browser paint the updated screen first before running your Effect. If your Effect is doing something visual (for example, positioning a tooltip), and the delay is noticeable (for example, it flickers), replace `useEffect` with [`useLayoutEffect`.](https://react.dev/reference/react/useLayoutEffect)
- Effects **only run on the client**. They don't run during server rendering.

## Usage

### Connecting to an external system

Some components need to stay connected to the network, some browser API, or a third-party library, while they are displayed on the page. These systems aren't controlled by React, so they are called _external_.

To [connect your component to some external system,](https://react.dev/learn/synchronizing-with-effects) call `useEffect` at the top level of your component:

```javascript
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

You need to pass two arguments to `useEffect`:

1. A _setup function_ with setup code that connects to that system.
   - It should return a _cleanup function_ with cleanup code that disconnects from that system.
2. A _list of dependencies_ including every value from your component used inside of those functions.

React calls your setup and cleanup functions whenever it's necessary, which may happen multiple times:

1. Your setup code runs when your component is added to the page _(mounts)_.
2. After every commit of your component where the dependencies have changed:
   - First, your cleanup code runs with the old props and state.
   - Then, your setup code runs with the new props and state.
3. Your cleanup code runs one final time after your component is removed from the page _(unmounts)_.

> **Note:** An Effect lets you keep your component synchronized with some external system (like a chat service). Here, _external system_ means any piece of code that's not controlled by React, such as:
> - A timer managed with `setInterval()` and `clearInterval()`.
> - An event subscription using `window.addEventListener()` and `window.removeEventListener()`.
> - A third-party animation library with an API like `animation.start()` and `animation.reset()`.
>
> **If you're not connecting to any external system, [you probably don't need an Effect.](https://react.dev/learn/you-might-not-need-an-effect)**

### Wrapping Effects in custom Hooks

Effects are an ["escape hatch":](https://react.dev/learn/escape-hatches) you use them when you need to "step outside React" and when there is no better built-in solution for your use case. If you find yourself often needing to manually write Effects, it's usually a sign that you need to extract some [custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) for common behaviors your components rely on.

```javascript
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = { serverUrl, roomId };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Then you can use it from any component like this:

```javascript
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  useChatRoom({ roomId, serverUrl });
  // ...
```

### Fetching data with Effects

You can use an Effect to fetch data for your component. Note that [if you use a framework,](https://react.dev/learn/creating-a-react-app#full-stack-frameworks) using your framework's data fetching mechanism will be a lot more efficient than writing Effects manually.

```javascript
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

Note the `ignore` variable which is initialized to `false`, and is set to `true` during cleanup. This ensures your code doesn't suffer from "race conditions": network responses may arrive in a different order than you sent them.

### Specifying reactive dependencies

Notice that you can't "choose" the dependencies of your Effect. Every **reactive value** used by your Effect's code must be declared as a dependency. Your Effect's dependency list is determined by the surrounding code.

To remove a dependency, you need to ["prove" to the linter that it _doesn't need_ to be a dependency.](https://react.dev/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

- **An Effect with empty dependencies** (`[]`) doesn't re-run when any of your component's props or state change.
- **An Effect with no dependency array** re-runs after every commit.

### Updating state based on previous state from an Effect

When you want to update state based on previous state from an Effect, pass an updater function:

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Pass a state updater
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Now count is not a dependency

  return <h1>{count}</h1>;
}
```

### Removing unnecessary object dependencies

If your Effect depends on an object or a function created during rendering, it might run too often. Avoid using an object created during rendering as a dependency. Instead, create the object inside the Effect.

### Removing unnecessary function dependencies

If your Effect depends on a function created during rendering, it might run too often. Avoid using a function created during rendering as a dependency. Instead, declare it inside the Effect.

## Troubleshooting

### My Effect runs twice when the component mounts

When Strict Mode is on, in development, React runs setup and cleanup one extra time before the actual setup. This is a stress-test that verifies your Effect's logic is implemented correctly.

### My Effect runs after every re-render

First, check that you haven't forgotten to specify the dependency array. If you've specified the dependency array but your Effect still re-runs in a loop, it's because one of your dependencies is different on every re-render.

### My Effect keeps re-running in an infinite cycle

If your Effect runs in an infinite cycle, these two things must be true:

- Your Effect is updating some state.
- That state leads to a re-render, which causes the Effect's dependencies to change.

Consider whether [removing the Effect altogether](https://react.dev/learn/you-might-not-need-an-effect) would simplify your logic.

### My cleanup logic runs even though my component didn't unmount

The cleanup function runs not only during unmount, but before every re-render with changed dependencies. Additionally, in development, React runs setup+cleanup one extra time immediately after component mounts.

### My Effect does something visual, and I see a flicker before it runs

If your Effect must block the browser from painting the screen, replace `useEffect` with [`useLayoutEffect`](https://react.dev/reference/react/useLayoutEffect). Note that this shouldn't be needed for the vast majority of Effects.
