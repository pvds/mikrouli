/**
 * Get the image name without the extension
 * @param {string | undefined} fileName - The image file name like "image.jpg"
 * @return {string | undefined} - The image name without the extension like "image"
 */
export const getImageName = (fileName) =>
	fileName?.split(".").slice(0, -1).join(".");
