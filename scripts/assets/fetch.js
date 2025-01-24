import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { logDebug, logError, logInfo, logSuccess, logWarn } from "../util/log.js";

const OUTPUT_DIR = path.resolve(process.cwd(), "images/cms");
const IMAGES_JSON = path.resolve(process.cwd(), "src/data/generated/images.json");

const args = process.argv.slice(2);
const isCMS = args.includes("--cms");

if (isCMS) syncImages(OUTPUT_DIR, IMAGES_JSON);

export async function syncImages(imagesPath, dataPath) {
	logInfo("Syncing images with cms...");
	if (!fs.existsSync(dataPath)) {
		logWarn("No cms image data found");
		process.exit(0);
	}

	const cmsImages = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
	const { missing, unused } = checkImages(imagesPath, cmsImages);
	if (missing.length) await downloadContentfulAssets(missing);
	if (unused.length) deleteImages(imagesPath, unused);
	if (missing.length || unused.length) {
		logSuccess("Synced images with cms");
	} else {
		logSuccess("No images to sync");
	}
}

/**
 * Delete unused images.
 */
export function deleteImages(imagesPath, images = []) {
	logInfo("Deleting unused cms images...");
	for (const image of images) {
		const imagePath = path.join(imagesPath, image);
		fs.unlinkSync(imagePath);
		logDebug(`Deleted: ${image}`);
	}
	logSuccess(`Deleted ${images.length} unused cms images.`);
}

/**
 * Check which images need to be downloaded.
 */
export function checkImages(imagePath, images = []) {
	let missing = [];
	let unused = [];

	const downloadedImages = fs.readdirSync(imagePath);
	missing = images.filter((image) => {
		const fileName = path.basename(image);
		return !downloadedImages.includes(fileName);
	});
	unused = downloadedImages.filter((image) => {
		const imageNames = images.map((image) => path.basename(image));
		return !imageNames.includes(image);
	});

	return { missing, unused };
}

/**
 * Download assets from Contentful.
 */
export async function downloadContentfulAssets(images = []) {
	if (!images.length) {
		logWarn("No images to download");
		return;
	}

	try {
		logInfo("Fetching images from cms...");

		// Ensure download directory exists
		if (!fs.existsSync(OUTPUT_DIR)) {
			fs.mkdirSync(OUTPUT_DIR, { recursive: true });
		}

		// Download each asset
		for (const image of images) {
			const url = `https:${image}`;
			const fileName = path.basename(url);
			const outputPath = path.join(OUTPUT_DIR, fileName);

			await downloadImage(url, outputPath);
			logDebug(`Downloaded: ${fileName}`);
		}

		logSuccess(`Saved ${images?.length} images from cms`);
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
