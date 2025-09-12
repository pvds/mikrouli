/**
 * Extract error message from an unknown error object.
 * @param {unknown} e
 * @return {string}
 */
export const errMsg = (e) => (e instanceof Error ? e.message : String(e));
