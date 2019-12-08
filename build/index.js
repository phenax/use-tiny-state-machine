"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useStateMachine;

var _react = require("react");

/* eslint-disable prettier/prettier */
var sliceArgs = function sliceArgs(args, x, y) {
  return [].slice.call(args, x, y);
};

function noop() {}

function callValue(x) {
  return typeof x === 'function' ? x.apply(null, sliceArgs(arguments, 1)) : x;
}

function usePairState(initial) {
  var _useState = (0, _react.useState)([initial, null]),
      state = _useState[0],
      setPairState = _useState[1];

  var setState = function setState(state) {
    return setPairState(function (s) {
      return [typeof state === 'function' ? state(s[0]) : state, s[0]];
    });
  };

  return [state[0], state[1], setState];
}

function useStateMachine(stateChart) {
  var _usePairState = usePairState(stateChart.initial),
      state = _usePairState[0],
      prevState = _usePairState[1],
      setState = _usePairState[2]; // :: State<String>


  var _usePairState2 = usePairState(stateChart.context),
      context = _usePairState2[0],
      prevContext = _usePairState2[1],
      updateContext = _usePairState2[2]; // :: State<Context>


  var _useState2 = (0, _react.useState)(null),
      pendingAction = _useState2[0],
      setPendingAction = _useState2[1]; // :: State<[Function, ...*]>


  (0, _react.useEffect)(function () {
    setState(stateChart.initial);
  }, [stateChart.initial]);
  (0, _react.useEffect)(function () {
    var _stateChart$states$st = stateChart.states[state];
    _stateChart$states$st = _stateChart$states$st === void 0 ? {} : _stateChart$states$st;
    var onEntry = _stateChart$states$st.onEntry;
    var destroy = (onEntry || noop)(stateMachine, state);
    return typeof destroy === 'function' ? destroy : function () {};
  }, [state]);
  (0, _react.useEffect)(function () {
    if (!pendingAction) return noop;
    var action = pendingAction[0],
        _pendingAction$ = pendingAction[1],
        args = _pendingAction$ === void 0 ? [] : _pendingAction$;
    setPendingAction(null);
    var destroy = (action || noop).apply(null, [stateMachine].concat(args));
    return typeof destroy === 'function' ? destroy : function () {};
  }, [pendingAction]); // dispatch :: (String, ...*) -> ()

  function dispatch(transitionName) {
    var args = sliceArgs(arguments, 1);
    var stateTransitions = stateChart.states[state];

    var _ref = stateTransitions || {},
        _ref$on = _ref.on;

    _ref$on = _ref$on === void 0 ? {} : _ref$on;
    var transition = _ref$on[transitionName];

    var _ref2 = (typeof transition === "string" ? {
      target: transition
    } : transition) || {},
        target = _ref2.target,
        action = _ref2.action,
        newContext = _ref2.context,
        beforeStateChange = _ref2.beforeStateChange;

    if (!stateTransitions || !(target || action)) {
      throw new Error("Invalid chart as transition \"".concat(transitionName, "\" not available for state \"").concat(state, "\""));
    } // TODO: Cleanup for beforeStateChange


    beforeStateChange && beforeStateChange.apply(null, [stateMachine].concat(args));
    action && setPendingAction([action, args]);
    target && setState(target);
    newContext && updateContext(newContext);
  }

  function revertToLastState() {
    prevState && setState(prevState);
    prevContext && updateContext(prevContext);
  } // cata :: { [key: String]: String -> b } -> b


  var cata = function cata(pattern) {
    return callValue(state in pattern ? pattern[state] : pattern._, stateMachine);
  }; // matches :: String -> Boolean


  var matches = function matches(x) {
    return x === state;
  };

  var stateMachine = {
    id: stateChart.id,
    state: state,
    dispatch: dispatch,
    context: context,
    updateContext: updateContext,
    cata: cata,
    matches: matches,
    revertToLastState: revertToLastState
  };
  return stateMachine;
}

;