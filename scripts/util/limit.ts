type LimitFn = <T>(
	fn: (...args: unknown[]) => T | PromiseLike<T>,
	...args: unknown[]
) => Promise<T>;

interface Limit extends LimitFn {
	readonly activeCount: number;
	readonly pendingCount: number;
	clearQueue(): void;
}

export function pLimit(concurrency: number): Limit {
	if (!Number.isInteger(concurrency) || concurrency < 1) {
		throw new TypeError("Expected `concurrency` to be an integer >= 1");
	}

	const queue: Array<() => void> = [];
	let activeCount = 0;

	function drain(): void {
		while (activeCount < concurrency && queue.length) {
			const run = queue.shift();
			if (run) run();
		}
	}

	const limit: Limit = (<T>(
		fn: (...args: unknown[]) => T | PromiseLike<T>,
		...args: unknown[]
	) =>
		new Promise<T>((outerResolve) => {
			const start = (): void => {
				activeCount++;
				const result = Promise.resolve(fn(...args));

				outerResolve(result);
				result
					.finally(() => {
						activeCount--;
						queueMicrotask(drain);
					})
					.catch(() => {});
			};

			if (activeCount < concurrency) {
				queueMicrotask(start);
			} else {
				queue.push(start);
			}
		})) as Limit;

	Object.defineProperties(limit, {
		activeCount: { get: () => activeCount },
		pendingCount: { get: () => queue.length },
	});

	limit.clearQueue = (): void => {
		queue.length = 0;
	};

	return limit;
}
