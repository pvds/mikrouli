import sharp from "sharp";

import { PLACEHOLDERS_OUTPUT_PATH_RESOLVED } from "$util/dyn";
import { readJSON, writeJSON } from "$util/file";
import { logInfo, logSuccess } from "$util/log";

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

/**
 * Overwrite placeholders for a specific category in the JSON file.
 * @param {string} category - The category key (e.g., "cms" or "local").
 * @param {Record<string, string>} placeholders - An object containing new image placeholders.
 */
export const writePlaceholders = (category, placeholders) => {
	logInfo("\n", `Writing ${category} base64 placeholders...`);
	const data = /** @type {Record<string, Record<string, string> | string>} */ (
		readJSON(PLACEHOLDERS_OUTPUT_PATH_RESOLVED)
	);
	// Sort placeholders alphabetically and assign to the category
	data[category] = Object.fromEntries(Object.entries(placeholders).sort());

	writeJSON(PLACEHOLDERS_OUTPUT_PATH_RESOLVED, data);
	logSuccess(`Wrote ${category} placeholders`);
};
