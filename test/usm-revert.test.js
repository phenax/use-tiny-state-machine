/* eslint-disable react/prop-types */
import React from 'react';

import { mount, byId, text, simulate, runAllTimers } from 'react-test-render-fns';

import TrafficLights from './components/TrafficLights';
import TrafficLightsWithWalk from './components/TrafficLightsWithWalk';

jest.useFakeTimers();

const clickBtn = (buttonType, $root) => {
  const $btn = $root.find(byId(buttonType));
  simulate(new Event('click'), $btn);
};

describe('useStateMachine single state', () => {
  const checkState = (state, $root) => {
    expect(text($root.find(byId('state')))).toBe(state);
    expect(text($root.find(byId('cata')))).toBe(`${state} color`);
  };

  it('should be red after click', () => {
    const $root = mount(<TrafficLights />);
    checkState('green', $root);

    clickBtn('next', $root);
    checkState('red', $root);

    clickBtn('revert', $root);
    checkState('green', $root);
  });
});