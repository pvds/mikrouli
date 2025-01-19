import fs from "node:fs";
import path from "node:path";
import { createClient } from "contentful";
import { transformContentfulData } from "./transform.js";

// 1) Validate environment vars
if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
	console.error(
		"Missing Contentful environment vars (CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN).",
	);
	process.exit(1);
}

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const isDev = process.env.PUBLIC_ENVIRONMENT === "development";

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
	// We'll generate these file paths and check if all exist in dev mode.
	const contentPaths = contentTypes.map(({ id }) => path.resolve(`./src/lib/data/${id}.json`));
	const rawPath = path.resolve("./src/lib/data/content.json");
	const alPaths = [...contentPaths, rawPath];

	// If *all* files exist in dev, skip the fetch
	if (isDev && alPaths.every(fs.existsSync)) {
		console.info("Development mode. All cached files exist, skipping fetch.");
		return;
	}

	try {
		console.info("Fetching data from Contentful...");

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
		// if (isDev) writeJsonFile("./src/lib/data/content.json", rawData, 4);

		// Run your custom transform on the combined data
		const processedData = transformContentfulData(rawData);

		// Pretty-print in dev, minify in production
		const spacing = isDev ? 4 : 0;

		// Write each transformed content type to its own file
		for (const { id } of contentTypes) {
			const outputPath = path.resolve(`./src/lib/data/${id}.json`);
			writeJsonFile(outputPath, processedData[id], spacing);
		}
		// TODO: download & process images instead of writing them to a file
		if (isDev)
			writeJsonFile(path.resolve("./src/lib/data/images.json"), processedData.images, 4);

		// Wrap up
		console.info(
			`Success! Data saved for content types: ${contentTypes.map(({ id }) => id).join(", ")}`,
		);
	} catch (err) {
		console.error("Error fetching Contentful data:", err);
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
