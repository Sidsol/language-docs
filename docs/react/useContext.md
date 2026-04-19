---
sourceUrl: https://react.dev/reference/react/useContext
fetchedAt: 2026-04-19T00:00:00Z
language: react
---

# useContext

`useContext` is a React Hook that lets you read and subscribe to [context](https://react.dev/learn/passing-data-deeply-with-context) from your component.

```javascript
const value = useContext(SomeContext)
```

## Reference

### `useContext(SomeContext)`

Call `useContext` at the top level of your component to read and subscribe to [context.](https://react.dev/learn/passing-data-deeply-with-context)

```javascript
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

#### Parameters

- `SomeContext`: The context that you've previously created with [`createContext`](https://react.dev/reference/react/createContext). The context itself does not hold the information, it only represents the kind of information you can provide or read from components.

#### Returns

`useContext` returns the context value for the calling component. It is determined as the `value` passed to the closest `SomeContext` above the calling component in the tree. If there is no such provider, then the returned value will be the `defaultValue` you have passed to [`createContext`](https://react.dev/reference/react/createContext) for that context. The returned value is always up-to-date. React automatically re-renders components that read some context if it changes.

#### Caveats

- `useContext()` call in a component is not affected by providers returned from the _same_ component. The corresponding `<Context>` needs to be **above** the component doing the `useContext()` call.
- React **automatically re-renders** all the children that use a particular context starting from the provider that receives a different `value`. The previous and the next values are compared with the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. Skipping re-renders with [`memo`](https://react.dev/reference/react/memo) does not prevent the children receiving fresh context values.

## Usage

### Passing data deeply into the tree

Call `useContext` at the top level of your component to read and subscribe to [context.](https://react.dev/learn/passing-data-deeply-with-context)

```javascript
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

`useContext` returns the context value for the context you passed. To determine the context value, React searches the component tree and finds **the closest context provider above** for that particular context.

To pass context to a `Button`, wrap it or one of its parent components into the corresponding context provider:

```javascript
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}
```

> **Pitfall:** `useContext()` always looks for the closest provider _above_ the component that calls it. It searches upwards and does **not** consider providers in the component from which you're calling `useContext()`.

### Updating data passed via context

Often, you'll want the context to change over time. To update context, combine it with [state.](https://react.dev/reference/react/useState) Declare a state variable in the parent component, and pass the current state down as the context value to the provider.

```javascript
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext>
  );
}
```

### Specifying a fallback default value

If React can't find any providers of that particular context in the parent tree, the context value returned by `useContext()` will be equal to the default value that you specified when you [created that context](https://react.dev/reference/react/createContext):

```javascript
const ThemeContext = createContext(null);
```

The default value **never changes**. If you want to update context, use it with state as described above.

Often, instead of `null`, there is some more meaningful value you can use as a default:

```javascript
const ThemeContext = createContext('light');
```

### Overriding context for a part of the tree

You can override the context for a part of the tree by wrapping that part in a provider with a different value.

```javascript
<ThemeContext value="dark">
  ...
  <ThemeContext value="light">
    <Footer />
  </ThemeContext>
  ...
</ThemeContext>
```

You can nest and override providers as many times as you need.

### Optimizing re-renders when passing objects and functions

You can pass any values via context, including objects and functions.

```javascript
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext value={{ currentUser, login }}>
      <Page />
    </AuthContext>
  );
}
```

Whenever `MyApp` re-renders, this will be a _different_ object pointing at a _different_ function. To help React take advantage of that fact, you may wrap the `login` function with [`useCallback`](https://react.dev/reference/react/useCallback) and wrap the object creation into [`useMemo`](https://react.dev/reference/react/useMemo):

```javascript
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext value={contextValue}>
      <Page />
    </AuthContext>
  );
}
```

## Troubleshooting

### My component doesn't see the value from my provider

There are a few common ways that this can happen:

1. You're rendering `<SomeContext>` in the same component (or below) as where you're calling `useContext()`. Move `<SomeContext>` **above and outside** the component calling `useContext()`.
2. You may have forgotten to wrap your component with `<SomeContext>`, or you might have put it in a different part of the tree than you thought.
3. You might be running into some build issue with your tooling that causes `SomeContext` as seen from the providing component and `SomeContext` as seen by the reading component to be two different objects.

### I am always getting `undefined` from my context although the default value is different

You might have a provider without a `value` in the tree:

```javascript
// 🚩 Doesn't work: no value prop
<ThemeContext>
   <Button />
</ThemeContext>
```

If you forget to specify `value`, it's like passing `value={undefined}`.

You may have also mistakenly used a different prop name:

```javascript
// 🚩 Doesn't work: prop should be called "value"
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
```

In both of these cases you should see a warning from React in the console. To fix them, call the prop `value`:

```javascript
// ✅ Passing the value prop
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

Note that the [default value from your `createContext(defaultValue)` call](https://react.dev/reference/react/createContext) is only used **if there is no matching provider above at all.** If there is a `<SomeContext value={undefined}>` component somewhere in the parent tree, the component calling `useContext(SomeContext)` will receive `undefined` as the context value.
