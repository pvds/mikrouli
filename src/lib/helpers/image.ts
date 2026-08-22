export const getImageName = (
	fileName: string | undefined,
): string | undefined => fileName?.split(".").slice(0, -1).join(".");
