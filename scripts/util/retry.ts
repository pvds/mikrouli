import { logDebug } from "$util/log";

export const withRetry = async <TArgs extends unknown[], TResult>(
	fn: (...args: TArgs) => Promise<TResult>,
	fnArgs: [...TArgs],
	retries: number = 3,
): Promise<TResult> => {
	try {
		return await fn(...fnArgs);
	} catch (err) {
		if (retries > 0) {
			logDebug(`Retrying... ${retries} attempts left.`);
			return withRetry(fn, fnArgs, retries - 1);
		}
		throw err;
	}
};
