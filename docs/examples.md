# Examples

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
Unlike xstate, this library only supports 1D level of nesting for state machines but you can achieve that by using multiple `useTinyStateMachine`.

```js
const TrafficLight = ({ onEntry }) => {
  const trafficLight = useTinyStateMachine({
    id: 'trafficLight',
    initial: 'green',
    states: {
      green: { on: { NEXT: 'red' } },
      red: { on: { NEXT: 'orange' } },
      orange: { on: { NEXT: 'green' } },
    },
  });

  const pedestrianSign = useTinyStateMachine({
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

