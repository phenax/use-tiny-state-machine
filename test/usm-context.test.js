import React from 'react';

import { mount, byId, text, simulate, compose, find, runAllTimers } from 'react-test-render-fns';

import useStateMachine from '../src';

jest.useFakeTimers();

describe('useStateMachine with context', () => {
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
              setTimeout(() => {
                if (userId === 'other') {
                  return dispatch('FAILURE', new Error('User not found'));
                }
                return dispatch('SUCCESS', { userId, name: 'Akshay Nair' });
              }, 100);
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

  const Compo = () => {
    const { context, dispatch, cata } = useStateMachine(stateChart);
    return (
      <div>
        <button id="fetchBtnPhenax" onClick={() => dispatch('FETCH', 'phenax')}>
          Fetch phenax
        </button>
        <button id="fetchBtnOther" onClick={() => dispatch('FETCH', 'other')}>
          Fetch other
        </button>
        <div id="text">
          {cata({
            idle: () => 'Hey there',
            pending: () => 'Loading...',
            // TODO: Fix intermediate state issue
            success: () => `Hi ${context.data.name}`,
            failure: () => `Error: ${context.error.message}`,
          })}
        </div>
      </div>
    );
  };

  const clickBtn = ($root, buttonType) => {
    const $btn = $root.find(byId(buttonType));
    simulate(new Event('click'), $btn);
  };

  const getMessage = compose(text, find(byId('text')));

  it('should go from idle to pending to success with the FETCH phenax dispatch', () => {
    const $root = mount(<Compo />);

    expect(getMessage($root)).toBe('Hey there');
    clickBtn($root, 'fetchBtnPhenax');
    expect(getMessage($root)).toBe('Loading...');
    runAllTimers();
    expect(getMessage($root)).toBe('Hi Akshay Nair');
  });

  it('should go from idle to pending to failure with the FETCH other dispatch', () => {
    const $root = mount(<Compo />);

    expect(getMessage($root)).toBe('Hey there');
    clickBtn($root, 'fetchBtnOther');
    expect(getMessage($root)).toBe('Loading...');
    runAllTimers();
    expect(getMessage($root)).toBe('Error: User not found');
  });
});
