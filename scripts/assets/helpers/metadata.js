import path from "node:path";
import { IMAGES_METADATA_OUTPUT_PATH_RESOLVED } from "$util/dyn.js";
import { prepareDir, readJSON, writeJSON } from "$util/file.js";
import { logInfo, logSuccess } from "$util/log.js";

/**
 * @typedef {import('$types/content').ImageMeta} ImageMeta
 * @typedef {Record<string, ImageMeta>} Metadata
 *
 * Writes metadata for each image as a separate JSON file.
 * @param {string} category - The category (e.g., "cms" or "local").
 * @param {Metadata} metadata - The image metadata.
 */
export const writeMetadata = async (category, metadata) => {
	logInfo(`\nWriting ${category} images metadata...`);

	const outputPath = path.join(
		IMAGES_METADATA_OUTPUT_PATH_RESOLVED,
		category,
	);
	const outputMetadataPath = path.join(
		IMAGES_METADATA_OUTPUT_PATH_RESOLVED,
		"images.json",
	);
	prepareDir(outputPath, true);

	const metadataFileContents = /** @type {Record<string, Metadata>} */ (
		readJSON(outputMetadataPath)
	);
	metadataFileContents[category] = Object.fromEntries(
		Object.entries(metadata).sort(),
	);

	// Write each image metadata to its own file
	await Promise.all(
		Object.entries(metadata).map(async ([imageName, meta]) => {
			const filePath = path.join(outputPath, `${imageName}.json`);
			await writeJSON(filePath, meta);
		}),
	);

	// Sort placeholders alphabetically and assign to the category
	writeJSON(outputMetadataPath, metadataFileContents);

	logSuccess(`Wrote ${category} images metadata`);
};
