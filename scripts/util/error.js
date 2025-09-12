/** @type {(e: unknown) => string} */
export const errMsg = (e) => (e instanceof Error ? e.message : String(e));
