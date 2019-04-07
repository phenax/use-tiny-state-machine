"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

/* eslint-disable prettier/prettier */
var sliceArgs = function sliceArgs(args, x, y) {
  return [].slice.call(args, x, y);
};

function noop() {}

function callValue(x) {
  return typeof x === 'function' ? x.apply(null, sliceArgs(arguments, 1)) : x;
}

function useStateMachine(stateChart) {
  var _useState = (0, _react.useState)(stateChart.initial),
      state = _useState[0],
      setState = _useState[1]; // :: State<String>


  var _useState2 = (0, _react.useState)(stateChart.context),
      context = _useState2[0],
      updateContext = _useState2[1]; // :: State<Context>


  var _useState3 = (0, _react.useState)(null),
      pendingAction = _useState3[0],
      setPendingAction = _useState3[1]; // :: State<[Function, ...*]>


  (0, _react.useEffect)(function () {
    return setState(stateChart.initial);
  }, [stateChart.initial]);
  (0, _react.useEffect)(function () {
    var _stateChart$states$st = stateChart.states[state];
    _stateChart$states$st = _stateChart$states$st === void 0 ? {} : _stateChart$states$st;
    var onEntry = _stateChart$states$st.onEntry;
    return (onEntry || noop)(stateMachine, state);
  }, [state]);
  (0, _react.useEffect)(function () {
    if (!pendingAction) return noop;
    var action = pendingAction[0],
        _pendingAction$ = pendingAction[1],
        args = _pendingAction$ === void 0 ? [] : _pendingAction$;
    setPendingAction(null);
    return (action || noop).apply(null, [stateMachine].concat(args));
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
    matches: matches
  };
  return stateMachine;
}

var _default = useStateMachine;
exports.default = _default;