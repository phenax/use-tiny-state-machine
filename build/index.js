"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var sliceArgs = function sliceArgs(args, x, y) {
  return [].slice.call(args, x, y);
};

function noop() {}

function callValue(x) {
  return typeof x === 'function' ? x.apply(null, sliceArgs(arguments, 1)) : x;
}

function useStateMachine(stateChart) {
  var _useState = (0, _react.useState)(stateChart.initial),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1]; // :: State<String>


  var _useState3 = (0, _react.useState)(stateChart.context),
      _useState4 = _slicedToArray(_useState3, 2),
      context = _useState4[0],
      updateContext = _useState4[1]; // :: State<Context>


  var _useState5 = (0, _react.useState)(null),
      _useState6 = _slicedToArray(_useState5, 2),
      pendingAction = _useState6[0],
      setPendingAction = _useState6[1]; // :: State<[Function, ...*]>


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

    var _pendingAction = _slicedToArray(pendingAction, 2),
        action = _pendingAction[0],
        _pendingAction$ = _pendingAction[1],
        args = _pendingAction$ === void 0 ? [] : _pendingAction$;

    setPendingAction(null);
    return (action || noop).apply(void 0, [stateMachine].concat(_toConsumableArray(args)));
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


    beforeStateChange && beforeStateChange.apply(void 0, [stateMachine].concat(_toConsumableArray(args)));
    action && setPendingAction([action, args]);
    target && setState(target);
    newContext && updateContext(function (c) {
      return _objectSpread({}, c, newContext);
    });
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