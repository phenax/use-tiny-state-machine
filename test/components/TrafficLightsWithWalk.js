import React from 'react';

import useStateMachine from '../../src';

// eslint-disable-next-line react/prop-types
const TrafficLight = ({ onEntry }) => {
  const trafficLight = useStateMachine({
    id: 'traffixLight',
    initial: 'green',
    states: {
      green: { on: { NEXT: 'red' } },
      red: { on: { NEXT: 'orange' } },
      orange: { on: { NEXT: 'green' } },
    },
  });

  const walkSign = useStateMachine({
    id: 'walkSign',
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

  return (
    <div>
      <div id="light">{trafficLight.state}</div>
      <div id="walk">{walkSign.state}</div>
      <div>
        <button id="walkBtn" onClick={() => walkSign.dispatch('WALK', 1, 2)}>
          Walk
        </button>
      </div>
    </div>
  );
};

it('-', () => {});

export default TrafficLight;
