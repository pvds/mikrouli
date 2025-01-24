import fs from "node:fs";
import path from "node:path";
import { createClient } from "contentful";
import { logError, logInfo, logSuccess, logWarn } from "../util/log.js";
import { processContentfulData } from "./process.js";

// 1) Validate environment vars
if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
	logError(
		"Missing Contentful environment vars (CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN).",
	);
	process.exit(1);
}

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const args = process.argv.slice(2);
const isProd = args.includes("--prod");
const isForce = args.includes("--force");

// 2) Array of content types, each with an ID + the matching Contentful query
const contentTypes = [
	{ id: "navigation", query: "navigation" },
	{ id: "pages", query: "page" },
	{ id: "services", query: "service" },
	{ id: "posts", query: "post" },
];

// Create the Contentful client
const client = createClient({ space, accessToken });

/**
 * Fetch data from Contentful, transform it, and write each content type
 * to its own JSON file. In dev, JSON is pretty-printed; in production, minified.
 */
async function fetchContentfulData() {
	if (!isProd && !isForce) {
		logWarn("Development mode. Use --force to fetch fresh data.");
		return;
	}

	try {
		logInfo("Fetching data from cms...");

		// Fetch each content type in parallel
		const requests = contentTypes.map(({ query }) =>
			client.getEntries({ content_type: query }),
		);
		const results = await Promise.all(requests);

		// Assemble the raw data keyed by 'navigation', 'pages', etc.
		const rawData = {};
		for (const [i, { id }] of contentTypes.entries()) {
			rawData[id] = results[i].items;
		}

		// Run your custom transform on the combined data
		const processedData = processContentfulData(rawData);

		// Write raw data to a file
		// Only for debugging purposes in dev mode
		// if (!isProd) writeJsonFile(path.resolve(process.cwd(),"src/data/generated/content.json"), rawData, 4);
		// if (!isProd) writeJsonFile(path.resolve(process.cwd(),"src/data/generated/images.json"), processedData.images, 4);

		// Pretty-print in dev, minify in production
		const spacing = !isProd ? 4 : 0;

		// Write each transformed content type to its own file
		for (const { id } of contentTypes) {
			const outputPath = path.resolve(process.cwd(), `src/data/generated/${id}.json`);
			writeJsonFile(outputPath, processedData[id], spacing);
		}

		// Also store the final list of images we *might* need
		const imagesPath = path.resolve(process.cwd(), "src/data/generated/images.json");
		writeJsonFile(imagesPath, processedData.images, spacing);
		logSuccess("Fetched Contentful data");
	} catch (err) {
		logError("Error fetching cms data:", err);
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
