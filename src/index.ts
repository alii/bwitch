export type CaseExecutor<In, R> = (value: In) => R;
export type Case<T, R> = { value: T; execute: CaseExecutor<T, R> };

export interface Expression<T, R> {
  case: <In extends T, Next>(value: In, execute: CaseExecutor<In, Next>) => Expression<T, R | Next>;
  or: <Next>(execute: CaseExecutor<T, Next>) => R | Next;
  orThrow: () => R;
  orNull: () => R | null;
}

export function run<T, R>(rootValue: T, cases: Case<T, R>[], or: (value: T) => R): R {
  for (const { value, execute } of cases) {
    if (rootValue === value) {
      return execute(rootValue);
    }
  }
  return or(rootValue);
}

export function expression<T, R>(rootValue: T, cases: Case<T, R>[]): Expression<T, R> {
  return {
    case<In extends T, Next>(value: In, execute: CaseExecutor<In, Next>) {
      const nextCases = [...cases, { value, execute }] as Case<T, R | Next>[];
      return expression(rootValue, nextCases);
    },
    or<Next>(execute: CaseExecutor<T, Next>) {
      return run(rootValue, cases, value => execute(value));
    },
    orThrow() {
      throw new Error('Unhandled value passed to bwitch');
    },
    orNull() {
      return null;
    },
  };
}

export function bwitch<T, R = never>(value: T) {
  return expression(value, []);
}
