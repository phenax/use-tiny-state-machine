import React from 'react';

import useStateMachine from 'hooks/useStateMachine';

// eslint-disable-next-line react/prop-types
const TrafficLight = ({ onNext = () => {} }) => {
  const trafficLight = useStateMachine({
    id: 'traffixLight',
    initial: 'green',
    states: {
      green: {
        on: {
          NEXT: {
            target: 'red',
            action: onNext.bind(null, 'green'),
          },
        },
      },
      red: {
        on: {
          NEXT: {
            target: 'orange',
            action: onNext.bind(null, 'red'),
          },
        },
      },
      orange: {
        on: {
          NEXT: {
            target: 'green',
            action: onNext.bind(null, 'orange'),
          },
        },
      },
    },
  });

  return (
    <div>
      <div id="state">{trafficLight.state}</div>
      <div id="cata">
        {trafficLight.cata({
          green: () => 'green color',
          orange: () => 'orange color',
          red: () => 'red color',
        })}
      </div>
      <div>
        <button id="next" onClick={() => trafficLight.dispatch('NEXT', 1, 2)}>
          Next
        </button>
        <button id="prev" onClick={() => trafficLight.dispatch('PREV', 1, 2)}>
          Prev
        </button>
      </div>
    </div>
  );
};

it('-', () => {});

export default TrafficLight;
