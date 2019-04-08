
# useTinyStateMachine
A lightweight (~700 bytes) react hook to create and work with state machines

[![CircleCI](https://img.shields.io/circleci/project/github/phenax/use-tiny-state-machine/master.svg?style=for-the-badge)](https://circleci.com/gh/phenax/use-tiny-state-machine)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/use-tiny-state-machine.svg?style=for-the-badge)](https://www.npmjs.com/package/use-tiny-state-machine)
[![Codecov](https://img.shields.io/codecov/c/github/phenax/use-tiny-state-machine.svg?style=for-the-badge)](https://codecov.io/gh/phenax/use-tiny-state-machine)


[Read the documentation for more information](https://github.com/phenax/use-tiny-state-machine/tree/master/docs)

## Install

#### Import
```bash
yarn add use-tiny-state-machine
```


## Examples

### Manual traffic lights

```js
import useTinyStateMachine from 'use-tiny-state-machine';

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
  const { cata, state, dispatch } = useTinyStateMachine(stateChart);

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
import useTinyStateMachine from 'use-tiny-state-machine';

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
  const { cata, state, dispatch } = useTinyStateMachine(stateChart);

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
  const { context, dispatch, cata } = useTinyStateMachine(stateChart);
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

