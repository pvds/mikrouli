import path from "node:path";
import { IMAGES_METADATA_OUTPUT_PATH_RESOLVED } from "$util/dyn.js";
import { prepareDir, writeJSON } from "$util/file.js";
import { logInfo, logSuccess } from "$util/log.js";

/**
 * Writes metadata for each image as a separate JSON file.
 * @param {string} category - The category (e.g., "cms" or "local").
 * @param {Record<string, { placeholder: string, width: string, height: string, hasAlpha: boolean }>} metadata - The image metadata.
 */
export const writeMetadata = async (category, metadata) => {
	logInfo(`\nWriting ${category} images metadata...`);

	const outputDir = path.join(IMAGES_METADATA_OUTPUT_PATH_RESOLVED, category);
	prepareDir(outputDir, true);

	// Write each image metadata to its own file
	await Promise.all(
		Object.entries(metadata).map(async ([imageName, meta]) => {
			const filePath = path.join(outputDir, `${imageName}.json`);
			await writeJSON(filePath, meta);
		}),
	);

	logSuccess(`Wrote ${category} images metadata to separate files`);
};
