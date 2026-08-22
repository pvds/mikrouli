export const measure = (
	startTime: DOMHighResTimeStamp,
	accuracy: number = 2,
): string => {
	return `${((performance.now() - startTime) / 1000).toFixed(accuracy)} seconds`;
};
