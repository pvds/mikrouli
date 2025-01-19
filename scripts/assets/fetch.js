import fs from "node:fs";
import https from "node:https";
import path from "node:path";
/** @type {string[]} */
import images from "../../src/lib/data/images.json";

/**
 * Download assets from Contentful.
 */
async function downloadContentfulAssets() {
	const OUTPUT_DIR = "./images/contentful";
	try {
		console.info("Fetching assets from Contentful...");

		// Ensure download directory exists
		if (fs.existsSync(OUTPUT_DIR)) {
			fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
		}
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });

		// Download each asset
		for (const image of images) {
			const url = `https:${image}`;
			const fileName = path.basename(url);
			const outputPath = path.join(OUTPUT_DIR, fileName);

			await downloadImage(url, outputPath);
			console.log(`Downloaded: ${fileName}`);
		}

		console.info("All assets downloaded successfully!");
	} catch (err) {
		console.error("Error downloading assets:", err);
	}
}

/**
 * Download an image from a URL.
 */
function downloadImage(url, outputPath) {
	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(outputPath);
		https
			.get(url, (response) => {
				if (response.statusCode !== 200) {
					return reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
				}
				response.pipe(file);
				file.on("finish", () => file.close(resolve));
			})
			.on("error", (err) => reject(err));
	});
}

downloadContentfulAssets();
