/**
 * Escapes special regex characters in a string.
 *
 * @param {string} string - The string to escape.
 * @returns {string} - The escaped string.
 */
export const escapeRegex = (string) =>
	string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
