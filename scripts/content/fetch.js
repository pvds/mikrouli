import fs from "node:fs";
import path from "node:path";
import { createClient } from "contentful";
import {
	CONTENTFUL_ACCESS_TOKEN,
	CONTENTFUL_SPACE_ID,
	CONTENT_TYPES,
	IS_FORCE,
	IS_PROD,
} from "../util/const.js";
import { logError, logInfo, logSuccess, logWarn } from "../util/log.js";
import { processContentfulData } from "./process.js";

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
	logError(
		"Missing Contentful environment vars (CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN).",
	);
	process.exit(1);
}

// Create the Contentful client
/** @type {import('contentful').CreateClientParams} */
const clientParams = { space: CONTENTFUL_SPACE_ID, accessToken: CONTENTFUL_ACCESS_TOKEN };
const client = createClient(clientParams);

/**
 * Fetch data from Contentful, transform it, and write each content type
 * to its own JSON file. In dev, JSON is pretty-printed; in production, minified.
 */
async function fetchContentfulData() {
	if (!IS_PROD && !IS_FORCE) {
		logWarn("Development mode. Use --force to fetch fresh data.");
		return;
	}

	try {
		logInfo("Fetching data from cms...");

		// Fetch each content type in parallel
		const requests = CONTENT_TYPES.map(({ query }) =>
			client.getEntries({ content_type: query }),
		);
		const results = await Promise.all(requests);

		// Assemble the raw data keyed by 'navigation', 'pages', etc.
		const rawData = {};
		for (const [i, { id }] of CONTENT_TYPES.entries()) {
			rawData[id] = results[i].items;
		}

		// Run your custom transform on the combined data
		const processedData = processContentfulData(rawData);

		// Write raw data to a file
		// Only for debugging purposes in dev mode
		// if (!isProd) writeJsonFile(path.resolve(process.cwd(),"src/data/generated/content.json"), rawData, 4);
		// if (!isProd) writeJsonFile(path.resolve(process.cwd(),"src/data/generated/images.json"), processedData.images, 4);

		// Pretty-print in dev, minify in production
		const spacing = !IS_PROD ? 4 : 0;

		// Write each transformed content type to its own file
		for (const { id } of CONTENT_TYPES) {
			const outputPath = path.resolve(process.cwd(), `src/data/generated/${id}.json`);
			writeJsonFile(outputPath, processedData[id], spacing);
		}

		// Also store the final list of images we *might* need
		const imagesPath = path.resolve(process.cwd(), "src/data/generated/images.json");
		writeJsonFile(imagesPath, processedData.images, spacing);
		logSuccess("Fetched Contentful data");
	} catch (err) {
		logError("Error fetching cms data:", err.message);
		process.exit(1);
	}
}

/**
 * Helper for writing JSON data to file with optional spacing.
 */
function writeJsonFile(filePath, data, spacing = 0) {
	fs.writeFileSync(filePath, JSON.stringify(data, null, spacing));
}

fetchContentfulData();
