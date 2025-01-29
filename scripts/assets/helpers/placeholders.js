import sharp from "sharp";

/**
 * Generate a small blurred placeholder image.
 * @param {string} inputPath - The path to the original image.
 * @param {string} outputPath - The path to save the placeholder (if provided).
 * @param {boolean} asBase64 - Whether to return the image as a base64 string.
 * @returns {Promise<string|sharp.OutputInfo|void>} - Base64 string if `asBase64` is true, otherwise
 * saves to file.
 */
export const generatePlaceholder = async (inputPath, outputPath = "", asBase64 = true) => {
	const quality = 50;
	const image = sharp(inputPath)
		.resize({ width: 16 })
		.blur()
		.toFormat("webp", { quality, alphaQuality: quality });

	if (!asBase64) {
		await image.toFile(outputPath);
	} else {
		const buffer = await image.toBuffer();
		return `data:image/webp;base64,${buffer.toString("base64")}`;
	}
};
