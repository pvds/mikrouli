import fs from "node:fs";
import path from "node:path";
import { createClient } from "contentful";

// Read secrets from environment vars
const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const isDev = process.env.ENVIRONMENT === "development";

// Create the Contentful client
const client = createClient({
	space,
	accessToken,
});

// The JSON file to write the fetched data into
const cachePath = path.resolve("./src/siteData.json");

async function fetchContentfulData() {
	// Skip fetching in dev if cache file already exists
	if (isDev && fs.existsSync(cachePath)) {
		console.info(
			"Development mode cache found. Skipping Contentful fetch.",
		);
		return;
	}

	try {
		console.info("Fetching data from Contentful...");
		const [navigation, pages] = await Promise.all([
			client.getEntries({ content_type: "navigation" }),
			client.getEntries({ content_type: "page" }),
		]);

		const data = {
			navigation: navigation.items,
			pages: pages.items,
		};

		fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
		console.info(`Success! Data cached at: ${cachePath}`);
	} catch (err) {
		console.error("Error fetching Contentful data:", err);
		process.exit(1);
	}
}

fetchContentfulData();
