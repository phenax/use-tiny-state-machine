
declare module "use-tiny-state-machine" {
  type MaybeFunction<T, R = any> = R | ((a: T) => R)
  export type CataPattern<T extends string, R = any> =
    { [key in T | '_']: MaybeFunction<T, R> };

  export type StateMachine<S extends string, T extends string, C> = {
    id: string
    state: S
    dispatch: (t: T, ...args: any[]) => void
    context: C
    updateContext: (c: C | ((prev: C) => C)) => void
    cata: <R = any>(pattern: CataPattern<S, R>) => R
    matches: (s: S) => boolean
    revertToLastState: () => void
  };

  export type TransitionTarget<S extends string, T extends string, C> = S | {
    target: S
    beforeStateChange?: (sm: StateMachine<S, T, C>) => any
  };

  export type StateChart<S extends string, T extends string, C = any> = {
    id?: string
    initial: S
    context?: C
    states: {
      [key in S]: {
        onEntry?: (sm: StateMachine<S, T, C>) => any
        on?: {
          [key in T]: TransitionTarget<S, T, C>
        }
      }
    }
  };

  export default function useStateMachine<S extends string = string, T extends string = string, C = any>(stateChart: StateChart<S, T, C>): StateMachine<S, T, C>;
}
