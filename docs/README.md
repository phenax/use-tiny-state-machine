# useStateMachine
A lightweight react hook to create and work with state machines

[![CircleCI](https://img.shields.io/circleci/project/github/phenax/use-state-machine/master.svg?style=for-the-badge)](https://circleci.com/gh/phenax/use-state-machine)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@phenax/use-state-machine.svg?style=for-the-badge)](https://www.npmjs.com/package/@phenax/use-state-machine)
[![Codecov](https://img.shields.io/codecov/c/github/phenax/use-state-machine.svg?style=for-the-badge)](https://codecov.io/gh/phenax/use-state-machine)


## Install

#### Import
```bash
yarn add @phenax/use-state-machine
```

## Motivation

This library is heavily inspired by [xstate](https://github.com/davidkpiano/xstate). XState works beautifully for most use cases but the size of the library comes around to [12.2KB](https://bundlephobia.com/result?p=xstate@4.4.0) minified and gzipped, which I've found is a bit hard to justify using in a small project. This library was written for the sole purpose of being a tiniest version of xstate focused on its usage as a react hooks.


## Learn more

* [API docs](./api.md)
* [Some examples](./examples.md)
