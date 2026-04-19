---
sourceUrl: https://react.dev/reference/react/useRef
fetchedAt: 2026-04-19T00:00:00Z
language: react
---

# useRef

`useRef` is a React Hook that lets you reference a value that's not needed for rendering.

```javascript
const ref = useRef(initialValue)
```

## Reference

### `useRef(initialValue)`

Call `useRef` at the top level of your component to declare a [ref.](https://react.dev/learn/referencing-values-with-refs)

```javascript
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

#### Parameters

- `initialValue`: The value you want the ref object's `current` property to be initially. It can be a value of any type. This argument is ignored after the initial render.

#### Returns

`useRef` returns an object with a single property:

- `current`: Initially, it's set to the `initialValue` you have passed. You can later set it to something else. If you pass the ref object to React as a `ref` attribute to a JSX node, React will set its `current` property.

On the next renders, `useRef` will return the same object.

#### Caveats

- You can mutate the `ref.current` property. Unlike state, it is mutable. However, if it holds an object that is used for rendering (for example, a piece of your state), then you shouldn't mutate that object.
- When you change the `ref.current` property, **React does not re-render your component.** React is not aware of when you change it because a ref is a plain JavaScript object.
- Do not write _or read_ `ref.current` during rendering, except for [initialization.](#avoiding-recreating-the-ref-contents) This makes your component's behavior unpredictable.
- In Strict Mode, React will call your component function twice in order to help you find accidental impurities.

## Usage

### Referencing a value with a ref

Call `useRef` at the top level of your component to declare one or more [refs.](https://react.dev/learn/referencing-values-with-refs)

```javascript
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` returns a ref object with a single `current` property initially set to the initial value you provided.

On the next renders, `useRef` will return the same object. You can change its `current` property to store information and read it later. This might remind you of [state](https://react.dev/reference/react/useState), but there is an important difference.

**Changing a ref does not trigger a re-render.** This means refs are perfect for storing information that doesn't affect the visual output of your component.

```javascript
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}

function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

By using a ref, you ensure that:

- You can **store information** between re-renders (unlike regular variables, which reset on every render).
- Changing it **does not trigger a re-render** (unlike state variables, which trigger a re-render).
- The **information is local** to each copy of your component (unlike the variables outside, which are shared).

> **Pitfall:** Do not write _or read_ `ref.current` during rendering.
>
> ```javascript
> function MyComponent() {
>   // ...
>   // 🚩 Don't write a ref during rendering
>   myRef.current = 123;
>   // ...
>   // 🚩 Don't read a ref during rendering
>   return <h1>{myOtherRef.current}</h1>;
> }
> ```
>
> You can read or write refs **from event handlers or effects** instead.

### Manipulating the DOM with a ref

It's particularly common to use a ref to manipulate the [DOM.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) React has built-in support for this.

First, declare a ref object with an initial value of `null`:

```javascript
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

Then pass your ref object as the `ref` attribute to the JSX of the DOM node you want to manipulate:

```javascript
  // ...
  return <input ref={inputRef} />;
```

After React creates the DOM node and puts it on the screen, React will set the `current` property of your ref object to that DOM node. Now you can access the `<input>`'s DOM node and call methods like [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):

```javascript
  function handleClick() {
    inputRef.current.focus();
  }
```

React will set the `current` property back to `null` when the node is removed from the screen.

Read more about [manipulating the DOM with refs.](https://react.dev/learn/manipulating-the-dom-with-refs)

### Avoiding recreating the ref contents

React saves the initial ref value once and ignores it on the next renders.

```javascript
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Although the result of `new VideoPlayer()` is only used for the initial render, you're still calling this function on every render. To solve it, you may initialize the ref like this instead:

```javascript
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Normally, writing or reading `ref.current` during render is not allowed. However, it's fine in this case because the result is always the same, and the condition only executes during initialization so it's fully predictable.

## Troubleshooting

### I can't get a ref to a custom component

If you try to pass a `ref` to your own component like this:

```javascript
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

You might get an error in the console. By default, your own components don't expose refs to the DOM nodes inside them.

To fix this, add `ref` to the list of props your component accepts and pass `ref` as a prop to the relevant child built-in component:

```javascript
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
}

export default MyInput;
```

Then the parent component can get a ref to it.

Read more about [accessing another component's DOM nodes.](https://react.dev/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)
