/**
 * Converts a rem value to pixels
 * @param {string} rem
 * @return {number}
 */
export const remToPx = (rem) =>
	Number.parseFloat(rem) * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
