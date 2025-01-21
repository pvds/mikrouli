import fs from "node:fs";
import path from "node:path";
import { createClient } from "contentful";
import { downloadContentfulAssets } from "../assets/fetch.js";
import { processImages } from "../assets/images.js";
import { logError, logInfo, logSuccess, logWarn } from "../util/log.js";
import { transformContentfulData } from "./transform.js";

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
		logWarn("Development mode. All cached files exist, skipping fetch.");
		return;
	}

	try {
		logInfo("Fetching data from CMS...");

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

		// Write raw data to a file
		// Only for debugging purposes in dev mode
		// if (!isProd) writeJsonFile("./src/lib/data/content.json", rawData, 4);
		// if (!isProd) writeJsonFile(path.resolve("./src/lib/data/images.json"), processedData.images, 4);

		// Run your custom transform on the combined data
		const processedData = transformContentfulData(rawData);

		// Pretty-print in dev, minify in production
		const spacing = !isProd ? 4 : 0;

		// Write each transformed content type to its own file
		for (const { id } of contentTypes) {
			const outputPath = path.resolve(`./src/lib/data/${id}.json`);
			writeJsonFile(outputPath, processedData[id], spacing);
		}

		if (isProd || isForce) {
			await downloadContentfulAssets(processedData.images).then(() => {
				processImages("cms");
			});
		}

		logSuccess("Saved data from CMS!");
	} catch (err) {
		logError("Error fetching CMS data:", err);
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
