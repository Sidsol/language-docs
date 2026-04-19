---
sourceUrl: https://react.dev/reference/react/useCallback
fetchedAt: 2026-04-19T00:00:00Z
language: react
---

# useCallback

`useCallback` is a React Hook that lets you cache a function definition between re-renders.

```javascript
const cachedFn = useCallback(fn, dependencies)
```

> **Note:** [React Compiler](https://react.dev/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useCallback` calls. You can use the compiler to handle memoization automatically.

## Reference

### `useCallback(fn, dependencies)`

Call `useCallback` at the top level of your component to cache a function definition between re-renders:

```javascript
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

#### Parameters

- `fn`: The function value that you want to cache. It can take any arguments and return any values. React will return (not call!) your function back to you during the initial render. On next renders, React will give you the same function again if the `dependencies` have not changed since the last render. Otherwise, it will give you the function that you have passed during the current render, and store it in case it can be reused later.

- `dependencies`: The list of all reactive values referenced inside of the `fn` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison algorithm.

#### Returns

On the initial render, `useCallback` returns the `fn` function you have passed. During subsequent renders, it will either return an already stored `fn` function from the last render (if the dependencies haven't changed), or return the `fn` function you have passed during this render.

#### Caveats

- `useCallback` is a Hook, so you can only call it **at the top level of your component** or your own Hooks.
- React will not throw away the cached function unless there is a specific reason to do that.

## Usage

### Skipping re-rendering of components

When you optimize rendering performance, you will sometimes need to cache the functions that you pass to child components.

By default, when a component re-renders, React re-renders all of its children recursively. This is why, when `ProductPage` re-renders with a different `theme`, the `ShippingForm` component _also_ re-renders. You can tell `ShippingForm` to skip re-rendering when its props are the same as on last render by wrapping it in [`memo`](https://react.dev/reference/react/memo):

```javascript
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**This is when caching a function becomes important!** Without `useCallback`, every re-render would create a new function, defeating the `memo` optimization:

```javascript
function ProductPage({ productId, referrer, theme }) {
  // Tell React to cache your function between re-renders...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...so as long as these dependencies don't change...

  return (
    <div className={theme}>
      {/* ...ShippingForm will receive the same props and can skip re-rendering */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

> **Note:** You should only rely on `useCallback` as a performance optimization. If your code doesn't work without it, find the underlying problem and fix it first. Then you may add `useCallback` back.

### Updating state from a memoized callback

Sometimes, you might need to update state based on previous state from a memoized callback. You can remove the dependency by passing an [updater function](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state) instead:

```javascript
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ No need for the todos dependency
  // ...
```

### Preventing an Effect from firing too often

Sometimes, you might want to call a function from inside an [Effect.](https://react.dev/learn/synchronizing-with-effects) However, it's even better to move your function inside the Effect:

```javascript
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      // ✅ No need for useCallback or function dependencies!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

### Optimizing a custom Hook

If you're writing a [custom Hook,](https://react.dev/learn/reusing-logic-with-custom-hooks) it's recommended to wrap any functions that it returns into `useCallback`:

```javascript
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return { navigate, goBack };
}
```

## Troubleshooting

### Every time my component renders, `useCallback` returns a different function

Make sure you've specified the dependency array as a second argument!

```javascript
// 🔴 Returns a new function every time: no dependency array
const handleSubmit = useCallback((orderDetails) => { ... });

// ✅ Does not return a new function unnecessarily
const handleSubmit = useCallback((orderDetails) => { ... }, [productId, referrer]);
```

### I need to call `useCallback` for each list item in a loop, but it's not allowed

You can't call `useCallback` in a loop. Instead, extract a component for an individual item and put `useCallback` there:

```javascript
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useCallback at the top level:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```
