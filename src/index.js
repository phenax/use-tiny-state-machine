/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';

const sliceArgs = (args, x, y) => [].slice.call(args, x, y);

function noop() {}
function callValue(x) {
  return typeof x === 'function' ? x.apply(null, sliceArgs(arguments, 1)) : x;
}

function useStateMachine(stateChart) {
  const [state, setState] = (useState(stateChart.initial)); // :: State<String>
  const [context, updateContext] = (useState(stateChart.context)); // :: State<Context>
  const [pendingAction, setPendingAction] = (useState(null)); // :: State<[Function, ...*]>

  useEffect(() => setState(stateChart.initial), [stateChart.initial]);

  useEffect(() => {
    const { [state]: { onEntry } = {} } = stateChart.states;
    return (onEntry || noop)(stateMachine, state);
  }, [state]);

  useEffect(() => {
    if (!pendingAction) return noop;
    const [ action, args = [] ] = pendingAction;
    setPendingAction(null);
    return (action || noop)(stateMachine, ...args);
  }, [pendingAction]);

  // dispatch :: (String, ...*) -> ()
  function dispatch(transitionName) {
    const args = sliceArgs(arguments, 1);
    const stateTransitions = stateChart.states[state];
    const { on: { [transitionName]: transition } = {} } = stateTransitions || {};
    const { target, action, context: newContext, beforeStateChange } =
      (typeof transition === "string" ? { target: transition } : transition) || {};

    if (!stateTransitions || !(target || action)) {
      throw new Error(
        `Invalid chart as transition "${transitionName}" not available for state "${state}"`
      );
    }

    // TODO: Cleanup for beforeStateChange
    beforeStateChange && beforeStateChange(stateMachine, ...args);
    action && setPendingAction([action, args]);
    target && setState(target);
    newContext && updateContext(c => ({ ...c, ...newContext }));
  }

  // cata :: { [key: String]: String -> b } -> b
  const cata = pattern => callValue(state in pattern ? pattern[state] : pattern._, stateMachine);

  // matches :: String -> Boolean
  const matches = x => x === state;

  const stateMachine = {
    id: stateChart.id,
    state, dispatch,
    context, updateContext,
    cata, matches
  };

  return stateMachine;
}

export default useStateMachine;
