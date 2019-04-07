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

describe('useStateMachine single state', () => {
  const checkState = (state, $root) => {
    expect(text($root.find(byId('state')))).toBe(state);
    expect(text($root.find(byId('cata')))).toBe(`${state} color`);
  };

  it('should be green', () => {
    const $root = mount(<TrafficLights />);
    checkState('green', $root);
  });

  it('should be red after click', () => {
    const $root = mount(<TrafficLights />);
    clickBtn($root, 'next');
    checkState('red', $root);
  });

  it('should be orange after 2 clicks', () => {
    const $root = mount(<TrafficLights />);
    clickBtn($root, 'next');
    clickBtn($root, 'next');
    checkState('orange', $root);
  });

  it('should be green after 2 clicks', () => {
    const $root = mount(<TrafficLights />);
    clickBtn($root, 'next');
    clickBtn($root, 'next');
    clickBtn($root, 'next');
    checkState('green', $root);
  });

  it('should call action on the specific transitions', () => {
    const onNext = jest.fn();
    const $root = mount(<TrafficLights onNext={onNext} />);

    expect(onNext).not.toHaveBeenCalled();
    clickBtn($root, 'next');
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onNext.mock.calls[0][0]).toBe('green');
    expect(onNext.mock.calls[0][2]).toBe(1);
    expect(onNext.mock.calls[0][3]).toBe(2);
    clickBtn($root, 'next');
    expect(onNext).toHaveBeenCalledTimes(2);
    expect(onNext.mock.calls[1][0]).toBe('red');
    expect(onNext.mock.calls[1][2]).toBe(1);
    expect(onNext.mock.calls[1][3]).toBe(2);
    clickBtn($root, 'next');
    expect(onNext).toHaveBeenCalledTimes(3);
    expect(onNext.mock.calls[2][0]).toBe('orange');
    expect(onNext.mock.calls[1][2]).toBe(1);
    expect(onNext.mock.calls[1][3]).toBe(2);
    clickBtn($root, 'next');
    expect(onNext).toHaveBeenCalledTimes(4);
    expect(onNext.mock.calls[3][0]).toBe('green');
    expect(onNext.mock.calls[1][2]).toBe(1);
    expect(onNext.mock.calls[1][3]).toBe(2);
  });

  it('should throw error on invalid transitions and state should remain unchanged', () => {
    const $root = mount(<TrafficLights />);
    expect(() => clickBtn($root, 'prev')).toThrowError();
    checkState('green', $root);
  });
});
