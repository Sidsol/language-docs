---
sourceUrl: https://react.dev/reference/react/useMemo
fetchedAt: 2026-04-19T00:00:00Z
language: react
---

# useMemo

`useMemo` is a React Hook that lets you cache the result of a calculation between re-renders.

```javascript
const cachedValue = useMemo(calculateValue, dependencies)
```

> **Note:** [React Compiler](https://react.dev/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useMemo` calls. You can use the compiler to handle memoization automatically.

## Reference

### `useMemo(calculateValue, dependencies)`

Call `useMemo` at the top level of your component to cache a calculation between re-renders:

```javascript
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

#### Parameters

- `calculateValue`: The function calculating the value that you want to cache. It should be pure, should take no arguments, and should return a value of any type. React will call your function during the initial render. On next renders, React will return the same value again if the `dependencies` have not changed since the last render. Otherwise, it will call `calculateValue`, return its result, and store it so it can be reused later.

- `dependencies`: The list of all reactive values referenced inside of the `calculateValue` code. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison.

#### Returns

On the initial render, `useMemo` returns the result of calling `calculateValue` with no arguments. During next renders, it will either return an already stored value from the last render (if the dependencies haven't changed), or call `calculateValue` again, and return the result that `calculateValue` has returned.

> **Note:** Caching return values like this is also known as [_memoization_,](https://en.wikipedia.org/wiki/Memoization) which is why this Hook is called `useMemo`.

#### Caveats

- `useMemo` is a Hook, so you can only call it **at the top level of your component** or your own Hooks.
- In Strict Mode, React will call your calculation function twice in order to help you find accidental impurities.
- React will not throw away the cached value unless there is a specific reason to do that.

## Usage

### Skipping expensive recalculations

To cache a calculation between re-renders, wrap it in a `useMemo` call at the top level of your component:

```javascript
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

You need to pass two things to `useMemo`:

1. A **calculation function** that takes no arguments, like `() =>`, and returns what you wanted to calculate.
2. A **list of dependencies** including every value within your component that's used inside your calculation.

> **Note:** You should only rely on `useMemo` as a performance optimization. If your code doesn't work without it, find the underlying problem and fix it first. Then you may add `useMemo` to improve performance.

### Skipping re-rendering of components

In some cases, `useMemo` can also help you optimize performance of re-rendering child components. If a child component is wrapped in [`memo`](https://react.dev/reference/react/memo), you can use `useMemo` to ensure stable prop references:

```javascript
export default function TodoList({ todos, tab, theme }) {
  // Tell React to cache your calculation between re-renders...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
    // ...so as long as these dependencies don't change...
  );
  return (
    <div className={theme}>
      {/* ...List will receive the same props and can skip re-rendering */}
      <List items={visibleTodos} />
    </div>
  );
}
```

### Preventing an Effect from firing too often

If your Effect depends on an object created during rendering, it might run too often. Instead of memoizing the object, move it inside the Effect:

```javascript
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      // ✅ No need for useMemo or object dependencies!
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

### Memoizing a dependency of another Hook

If you have a calculation that depends on an object created directly in the component body, move the object declaration inside of the `useMemo` calculation function:

```javascript
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]);
  // ✅ Only changes when allItems or text changes
  // ...
```

### Memoizing a function

To memoize a function with `useMemo`, your calculation function would have to return another function. Memoizing functions is common enough that React has a built-in Hook specifically for that. Wrap your functions into [`useCallback`](https://react.dev/reference/react/useCallback) instead of `useMemo` to avoid having to write an extra nested function:

```javascript
// Using useMemo (works but clunky)
const handleSubmit = useMemo(() => {
  return (orderDetails) => {
    post('/product/' + productId + '/buy', { referrer, orderDetails });
  };
}, [productId, referrer]);

// Using useCallback (preferred)
const handleSubmit = useCallback((orderDetails) => {
  post('/product/' + productId + '/buy', { referrer, orderDetails });
}, [productId, referrer]);
```

The two examples above are completely equivalent. The only benefit to `useCallback` is that it lets you avoid writing an extra nested function inside.

## Troubleshooting

### My calculation runs twice on every re-render

In [Strict Mode](https://react.dev/reference/react/StrictMode), React will call some of your functions twice instead of once. This is expected and shouldn't break your code. This **development-only** behavior helps you [keep components pure.](https://react.dev/learn/keeping-components-pure)

### My `useMemo` call is supposed to return an object, but returns undefined

In JavaScript, `() => {` starts the arrow function body, so the `{` brace is not a part of your object. To fix it, write a `return` statement explicitly:

```javascript
// ✅ This works and is explicit
const searchOptions = useMemo(() => {
  return {
    matchMode: 'whole-word',
    text: text
  };
}, [text]);
```

### Every time my component renders, the calculation in `useMemo` re-runs

Make sure you've specified the dependency array as a second argument!

```javascript
// 🔴 Recalculates every time: no dependency array
const visibleTodos = useMemo(() => filterTodos(todos, tab));

// ✅ Does not recalculate unnecessarily
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```

### I need to call `useMemo` for each list item in a loop, but it's not allowed

You can't call `useMemo` in a loop. Instead, extract a component for each item and memoize data for individual items:

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
  // ✅ Call useMemo at the top level:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```
