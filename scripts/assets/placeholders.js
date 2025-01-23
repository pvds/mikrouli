import fs from "node:fs";
import sharp from "sharp";

/**
 * Generate a small blurred placeholder image.
 * @param {string} inputPath - The path to the original image.
 * @param {string} outputPath - The path to save the placeholder (if provided).
 * @param {boolean} asBase64 - Whether to return the image as a base64 string.
 * @returns {Promise<string|sharp.OutputInfo>} - Base64 string if `asBase64` is true, otherwise saves to file.
 */
export const generatePlaceholder = async (inputPath, outputPath = "", asBase64 = true) => {
	const quality = 50;
	const image = sharp(inputPath)
		.resize({ width: 16 })
		.blur()
		.toFormat("webp", { quality, alphaQuality: quality });

	if (asBase64) {
		const buffer = await image.toBuffer();
		return `data:image/webp;base64,${buffer.toString("base64")}`;
	}
	await image.toFile(outputPath);
};

/**
 * Overwrite placeholders for a specific category in the JSON file.
 * @param {string} category - The category key (e.g., "cms" or "local").
 * @param {Object} placeholders - An object containing new image placeholders.
 * @param {string} outputPath - Path to the placeholders JSON file.
 */
export const writePlaceholders = (category, placeholders, outputPath) => {
	const data = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, "utf-8")) : {};

	data[category] = placeholders;
	fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

	console.info(`Successfully wrote placeholders under "${category}"`);
};
