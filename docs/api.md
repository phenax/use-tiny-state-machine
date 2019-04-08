# API

```haskell
useTinyStateMachine :: StateChart -> StateMachine
```

```js
const Component = () => {
  const { matches, cata, dispatch, state } = useTinyStateMachine(stateChart);
  return (
    /* ... */
  );
};
```

### StateChart instance/Options

```js
const stateChart = {
  id: 'trafficLight',
  initial: 'green', // Start with a green light
  states: {
    green: {
      on: {
        NEXT: 'red', // `NEXT: 'red'` is a shorthand for `NEXT: { target: 'red' }`
      },
    },
    orange: {
      on: {
        NEXT: {
          target: 'green',
          beforeStateChange: () => console.log('Get ready to go'),
          action: () => console.log('Time to hit the nitro!'),
        },
      },
    },
    red: {
      onEntry: () => console.log('STOP! Its a red light'),
      on: {
        NEXT: 'orange',
      },
    },
  },
};
```

NOTE: You can return a clean up function from inside both `action` and `onEntry`.
```js
const onEntry = () => {
  const timer = setTimeout(() => {/* do stuff */}, 1000);
  return () => clearTimeout(timer);
};
```


### StateMachine instance

* `state` - The current state of the machine.
```haskell
state :: String
```


* `dispatch` - Dispatch/Call a transition to either change state or call an action.
```haskell
dispatch :: (String, ...*) -> ()
```

```js
const onClick = () => dispatch('NEXT');
```


* `matches` - Returns true if current state is equal to given state
```haskell
matches :: String -> Boolean
```
```js
if (matches('red')) {
  console.log('STOP!');
}
```


* `cata` - Pattern match the current state to a function or value
```haskell
cata :: Object (b | String -> b) -> b
```

```js
// Handlers can be values or functions returning a value
const trafficMessage = cata({
  red: 'Stop',
  orange: () => 'Go slow',
  green: 'Go! Go! Go!',
});
```

```js
// You can also have a default handler using `_`
const pedestrianMessage = cata({
  red: 'Walk',
  _: 'Stop',
});
```


* `context` - Additional state data associated with the state machine
```haskell
context :: Object *
```


* `updateContext` - Additional state data associated with the state machine
```haskell
updateContext :: (Object a | Object a -> Object a) -> ()
```
