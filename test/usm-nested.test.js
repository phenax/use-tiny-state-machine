/* eslint-disable react/prop-types */
import React from 'react';

import { mount, byId, text, simulate, runAllTimers } from 'react-test-render-fns';

import TrafficLights from './components/TrafficLights';
import TrafficLightsWithWalk from './components/TrafficLightsWithWalk';

jest.useFakeTimers();

const clickBtn = ($root, buttonType) => {
  const $btn = $root.find(byId(buttonType));
  simulate(new Event('click'), $btn);
};

describe('useStateMachine with linked state', () => {
  const onEntry = jest.fn();
  const checkState = (light, $root) => {
    expect(text($root.find(byId('light')))).toBe(light);
    expect(text($root.find(byId('walk')))).toBe(light === 'red' ? 'walk' : 'stop');
  };

  beforeEach(() => {
    onEntry.mockClear();
  });

  it('should be green', () => {
    const $root = mount(<TrafficLightsWithWalk onEntry={onEntry} />);
    expect(onEntry).toHaveBeenCalledTimes(1);
    checkState('green', $root);
  });

  it('should turn to red after 1 second when walk button is clicked', () => {
    const $root = mount(<TrafficLightsWithWalk onEntry={onEntry} />);
    expect(onEntry).toHaveBeenCalledTimes(1);
    checkState('green', $root);
    clickBtn($root, 'walkBtn');
    checkState('green', $root);
    runAllTimers();
    runAllTimers();
    checkState('red', $root);
    expect(onEntry).toHaveBeenCalledTimes(2);
  });

  it('should call next only once even if walk button is pressed multiple times (action cancellation)', () => {
    const $root = mount(<TrafficLightsWithWalk onEntry={onEntry} />);
    expect(onEntry).toHaveBeenCalledTimes(1);
    clickBtn($root, 'walkBtn');
    clickBtn($root, 'walkBtn');
    clickBtn($root, 'walkBtn');
    clickBtn($root, 'walkBtn');
    clickBtn($root, 'walkBtn');
    clickBtn($root, 'walkBtn');
    clickBtn($root, 'walkBtn');
    checkState('green', $root);
    runAllTimers();
    runAllTimers();
    checkState('red', $root);
    expect(onEntry).toHaveBeenCalledTimes(2);
  });
});
