/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';

const sliceArgs = (args, x, y) => [].slice.call(args, x, y);

function noop() {}
function callValue(x) {
  return typeof x === 'function' ? x.apply(null, sliceArgs(arguments, 1)) : x;
}

function usePairState(initial) {
  const { 0: state, 1: setPairState } = useState([initial, null]);
  const setState = state => setPairState(s => [
    typeof state === 'function' ? state(s[0]) : state,
    s[0],
  ]);
  return [ state[0], state[1], setState ];
}

function useStateMachine(stateChart) {
  const { 0: state, 1: prevState, 2: setState } = usePairState(stateChart.initial); // :: State<String>
  const { 0: context, 1: prevContext, 2: updateContext } = usePairState(stateChart.context); // :: State<Context>
  const { 0: pendingAction, 1: setPendingAction } = useState(null); // :: State<[Function, ...*]>

  useEffect(() => setState(stateChart.initial), [stateChart.initial]);

  useEffect(() => {
    const { [state]: { onEntry } = {} } = stateChart.states;
    return (onEntry || noop)(stateMachine, state);
  }, [state]);

  useEffect(() => {
    if (!pendingAction) return noop;
    const { 0: action, 1: args = [] } = pendingAction;
    setPendingAction(null);
    return (action || noop).apply(null, [stateMachine].concat(args));
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
    beforeStateChange && beforeStateChange.apply(null, [stateMachine].concat(args));
    action && setPendingAction([action, args]);
    target && setState(target);
    newContext && updateContext(newContext);
  }

  function revertToLastState() {
    prevState && setState(prevState);
    prevContext && updateContext(prevContext);
  }

  // cata :: { [key: String]: String -> b } -> b
  const cata = pattern => callValue(state in pattern ? pattern[state] : pattern._, stateMachine);

  // matches :: String -> Boolean
  const matches = x => x === state;

  const stateMachine = {
    id: stateChart.id,
    state, dispatch,
    context, updateContext,
    cata, matches,
    revertToLastState,
  };

  return stateMachine;
}

export default useStateMachine;
