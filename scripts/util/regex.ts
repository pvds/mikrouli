export const escapeRegex = (string: string): string =>
	string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
