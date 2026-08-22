export const errMsg = (e: unknown): string =>
	e instanceof Error ? e.message : String(e);
