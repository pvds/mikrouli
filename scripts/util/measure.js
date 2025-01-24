/**
 * Measure the time between two points
 *
 * @param {DOMHighResTimeStamp} startTime variable that is set to performance.now()
 * @param {number} [accuracy] decimal places to round to
 * @return {string} time measurement in seconds
 * @example
 * const startTime = performance.now();
 * // do something
 * console.log(measure(startTime));
 */
export const measure = (startTime, accuracy = 2) => {
	return `${((performance.now() - startTime) / 1000).toFixed(accuracy)} seconds`;
};
