import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { logDebug, logError, logInfo, logSuccess, logWarn } from "../util/log.js";

/**
 * Download assets from Contentful.
 */
export async function downloadContentfulAssets(images = []) {
	if (!images.length) {
		logWarn("No images to download.");
		return;
	}

	const OUTPUT_DIR = path.resolve(process.cwd(), "images/cms");
	try {
		logInfo("Fetching images from CMS...");

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
			logDebug(`Downloaded: ${fileName}`);
		}

		logSuccess(`Saved ${images?.length} images from CMS!`);
	} catch (err) {
		logError("Error downloading assets:", err);
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
