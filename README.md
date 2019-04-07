
# useStateMachine
A lightweight react hook to create and work with state machines

[![CircleCI](https://img.shields.io/circleci/project/github/phenax/use-state-machine/master.svg?style=for-the-badge)](https://circleci.com/gh/phenax/use-state-machine)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@phenax/use-state-machine.svg?style=for-the-badge)](https://www.npmjs.com/package/@phenax/use-state-machine)
[![Codecov](https://img.shields.io/codecov/c/github/phenax/use-state-machine.svg?style=for-the-badge)](https://codecov.io/gh/phenax/use-state-machine)


[Read the documentation for more information](https://github.com/phenax/use-state-machine/tree/master/docs)

## Install

#### To add the project to your project
```bash
yarn add @phenax/use-state-machine
```

## Usage

#### Import it to your file
```js
import { createPipe, createPipes, fromClassPrototype, compose } from '@phenax/use-state-machine';
// Note: compose is a regular lodash-like compose function
```

# useStateMachine
A react hook to work with finite state machines.

For more information about state charts and state machines checkout https://github.com/davidkpiano/xstate


## Import

```js
import useStateMachine from '~/hooks/useStateMachine';
```


## API

```haskell
useStateMachine :: (StateChart, [*]) -> StateMachine
```

```js
const Component = () => {
  const { matches, cata, dispatch, state } = useStateMachine(stateChart);
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



## Examples

### Manual traffic lights

```js
import useStateMachine from '~/hooks/useStateMachine';

const stateChart = {
  id: 'traffixLight',
  initial: 'green',
  states: {
    green: { on: { NEXT: 'red' } },
    orange: { on: { NEXT: 'green' } },
    red: { on: { NEXT: 'orange' } },
  },
};

export default function ManualTrafficLights() {
  const { cata, state, dispatch } = useStateMachine(stateChart);

  return (
    <Fragment>
      <div
        className="trafficLight"
        style={{
          backgroundColor: cata({
            green: '#51e980',
            red: '#e74c3c',
            orange: '#ffa500',
          }),
        }}
      >
        The light is {state}
      </div>
      <button onClick={() => dispatch('NEXT')}>Next light</button>
    </Fragment>
  );
};
```


### Automated traffic lights with onEntry action
`onEntry` is called every time you enter a given state. `onEntry` is called with the current state machine instance.

```js
import useStateMachine from '~/hooks/useStateMachine';

const stateChart = {
  id: "traffixLight",
  initial: "green",
  states: {
    green: {
      onEntry: waitForNextLight,
      on: {
        NEXT: "red"
      }
    },
    orange: {
      onEntry: waitForNextLight,
      on: {
        NEXT: "green"
      }
    },
    red: {
      onEntry: waitForNextLight,
      on: {
        NEXT: "orange"
      }
    }
  }
};

function waitForNextLight({ dispatch }) {
  const timer = setTimeout(() => dispatch('NEXT'), 1000);
  return () => clearTimeout(timer);
}

function TrafficLights() {
  const { cata, state, dispatch } = useStateMachine(stateChart);

  return (
    <Fragment>
      <div
        style={{
          width: "30px",
          height: "30px",
          backgroundColor: cata({
            green: "#51e980",
            red: "#e74c3c",
            orange: "#ffa500"
          })
        }}
      >
        The light is {state}
      </div>
      <button onClick={() => dispatch("NEXT")}>Force next light</button>
    </Fragment>
  );
}
```

### Automated traffic lights with transition actions
The difference between using action and onEntry is that onEntry is called every time you enter a particular state where as transition actions are called when a particular action is triggered. The target property does the same as what it did in the previous examples.
Transition action is called with the state machine instance as well as any left over arguements from the disptach call.

In the example below, onNext will be called whenever the `NEXT` transition is dispatched.

```js
const stateChart = {
  id: "traffixLight",
  initial: "green",
  states: {
    green: {
      on: {
        NEXT: {
          target: "red",
          action: onNext,
        },
      }
    },
    orange: {
      on: {
        NEXT: {
          target: "green",
          action: onNext,
        },
      }
    },
    red: {
      on: {
        NEXT: {
          target: "orange",
          action: onNext,
        },
      }
    }
  }
};

function onNext({ dispatch }) {
  const timer = setTimeout(() => dispatch('NEXT'), 1000);
  return () => clearTimeout(timer);
}
```


### Multiple linked state charts
Unlike xstate, this library only supports 1D level of nesting for state machines but you can achieve that by using multiple `useStateMachine`.

```js
const TrafficLight = ({ onEntry }) => {
  const trafficLight = useStateMachine({
    id: 'trafficLight',
    initial: 'green',
    states: {
      green: { on: { NEXT: 'red' } },
      red: { on: { NEXT: 'orange' } },
      orange: { on: { NEXT: 'green' } },
    },
  });

  const pedestrianSign = useStateMachine({
    id: 'pedestrianSign',
    initial: trafficLight.cata({
      red: 'walk',
      _: 'stop',
    }),
    states: {
      stop: {
        onEntry,
        on: {
          WALK: {
            action: () => {
              const timer = setTimeout(() => trafficLight.dispatch('NEXT'), 1000);
              return () => clearTimeout(timer);
            },
          },
        },
      },
      walk: {
        onEntry,
        on: {
          WALK: { action: () => {} },
        },
      },
    },
  });

  const onWalkButtonClick = pedestrianSign.dispatch('WALK');

  return (
    /* ... */
  );
};

```



### Fetching data
You can use context to store any data associated with a state.

```js
const stateChart = {
  id: 'userData',
  initial: 'idle',
  context: {
    data: null,
    error: null,
  },
  states: {
    idle: {
      on: {
        FETCH: {
          target: 'pending',
          action: ({ dispatch }, userId) => {
            fetchUser(userId)
              .then(user => dispatch('SUCCESS', user))
              .catch(error => dispatch('FAILURE', error));
          },
        },
      },
    },
    pending: {
      on: {
        SUCCESS: {
          target: 'success',
          beforeStateChange: ({ updateContext }, data) => updateContext(c => ({ ...c, data })),
        },
        FAILURE: {
          target: 'failure',
          beforeStateChange: ({ updateContext }, error) => updateContext(c => ({ ...c, error })),
        },
      },
    },
  },
};

const UserData = () => {
  const { context, dispatch, cata } = useStateMachine(stateChart);
  return (
    <div>
      {cata({
        idle: () => (
          <button onClick={() => dispatch('FETCH')}>
            Fetch user data
          </button>
        ),
        pending: () => <Spinner />,
        success: () => `Hi ${context.data.name}`,
        failure: () => `Error: ${context.error.message}`,
      })}
    </div>
  );
};
```

