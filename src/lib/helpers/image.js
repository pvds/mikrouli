/**
 * Get the image name without the extension
 * @param {string} fileName - The image file name like "image.jpg"
 * @return {string} - The image name without the extension like "image"
 */
export const getImageName = (fileName) => fileName.split(".").slice(0, -1).join(".");
