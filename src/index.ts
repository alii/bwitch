export type CaseExecutor<In, R> = (value: In) => R;
export type Case<T, R> = {value: T; execute: CaseExecutor<T, R>};

export interface Expression<T, R> {
	case: <const In extends T, const Next>(
		value: In,
		execute: CaseExecutor<In, Next>,
	) => Expression<T, R | Next>;
	or: <const Next>(execute: CaseExecutor<T, Next>) => R | Next;
	orThrow: () => R;
	orNull: () => R | null;
}

export function run<T, R>(
	rootValue: T,
	cases: Case<T, R>[],
	or: (value: T) => R,
): R {
	for (const c of cases) {
		if (rootValue === c.value) {
			return c.execute(rootValue);
		}
	}

	return or(rootValue);
}

export function expression<T, R>(
	rootValue: T,
	cases: Case<T, R>[],
): Expression<T, R> {
	return {
		case: <const In extends T, const Next>(
			value: In,
			execute: CaseExecutor<In, Next>,
		) => {
			const nextCases = [
				...cases,
				{
					value,
					execute,
				},
			] as Case<T, R>[];

			return expression<T, R | Next>(rootValue, nextCases);
		},

		or: <const Next>(execute: CaseExecutor<T, Next>) => {
			return run<T, R | Next>(rootValue, cases, value => execute(value));
		},

		orThrow: (getMessage?: string | ((value: T) => string)) => {
			return run(rootValue, cases, () => {
				const message =
					getMessage instanceof Function
						? getMessage(rootValue)
						: getMessage ?? 'Unhandled value passed to bwitch';

				throw new Error(message);
			});
		},

		orNull: () => {
			return run(rootValue, cases, () => null);
		},
	};
}

export function bwitch<const T, R = never>(value: T) {
	return expression<T, R>(value, []);
}
