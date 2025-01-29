import { METADATA_OUTPUT_PATH_RESOLVED } from "$util/dyn.js";
import { readJSON, writeJSON } from "$util/file.js";
import { logInfo, logSuccess } from "$util/log.js";

/**
 * Overwrite placeholders for a specific category in the JSON file.
 *
 * @param {string} category - The category key (e.g., "cms" or "local").
 * @param {Record<string, {placeholder: string, width:string, height:string, hasAlpha:boolean}>} metadata - An object containing images metadata.
 */
export const writeMetadata = (category, metadata) => {
	logInfo("\n", `Writing ${category} images metadata...`);
	const metadataFileContents =
		/** @type {Record<string, Record<string, {placeholder: string, width:string, height:string, hasAlpha:boolean}> | string>} */ (
			readJSON(METADATA_OUTPUT_PATH_RESOLVED)
		);

	// Sort placeholders alphabetically and assign to the category
	metadataFileContents[category] = Object.fromEntries(Object.entries(metadata).sort());

	writeJSON(METADATA_OUTPUT_PATH_RESOLVED, metadataFileContents);
	logSuccess(`Wrote ${category} images metadata`);
};
