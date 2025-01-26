import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { IMAGES_JSON_OUTPUT_PATH_RESOLVED, IMAGE_OUTPUT_PATH_RESOLVED, IS_CMS } from "$util/dyn";
import { prepareDir } from "$util/file";
import pLimit from "p-limit";

import { logDebug, logError, logInfo, logSuccess, logWarn } from "$util/log";
import { withRetry } from "$util/retry";

if (IS_CMS)
	await syncImages(
		path.join(IMAGE_OUTPUT_PATH_RESOLVED, "cms"),
		IMAGES_JSON_OUTPUT_PATH_RESOLVED,
	);

/**
 * Syncs images with the CMS by downloading missing assets and removing unused ones.
 *
 * @param {string} imagesPath - The path to the local image folder.
 * @param {string} dataPath - The path to the CMS JSON file containing image data.
 * @returns {Promise<void>}
 */
export async function syncImages(imagesPath, dataPath) {
	logInfo("Syncing images with cms...");
	if (!fs.existsSync(dataPath)) {
		logWarn("No cms image data found");
		process.exit(0);
	}
	if (!fs.existsSync(imagesPath)) fs.mkdirSync(imagesPath, { recursive: true });

	const cmsImages = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
	const { missing, unused } = checkImages(imagesPath, cmsImages);

	if (missing.length) await downloadContentfulAssets(missing);
	if (unused.length) deleteImages(imagesPath, unused);

	if (missing.length || unused.length) logSuccess("Synced images with cms");
	else logSuccess("No images to sync");
}

/**
 * Delete unused images.
 *
 * @param {string} imagesPath - The path to the local image folder.
 * @param {string[]} images - List of image file names to delete.
 */
function deleteImages(imagesPath, images = []) {
	logInfo("Deleting unused cms images...");
	for (const image of images) {
		const imagePath = path.join(imagesPath, image);
		fs.unlinkSync(imagePath);
		logDebug(`Deleted: ${image}`);
	}
	logSuccess(`Deleted ${images.length} unused cms image(s).`);
}

/**
 * Check which images need to be downloaded and which are unused.
 *
 * @param {string} imagePath - The path to the local image folder.
 * @param {string[]} images - List of image URLs from the CMS.
 * @returns {{ missing: string[], unused: string[] }} An object containing arrays for `missing`
 * and `unused` images.
 */
function checkImages(imagePath, images = []) {
	const downloadedImages = fs.readdirSync(imagePath);
	const imageBaseNames = images.map((image) => path.basename(image));
	const missing = images.filter((image) => {
		const fileName = path.basename(image);
		return !downloadedImages.includes(fileName);
	});
	const unused = downloadedImages.filter((image) => {
		return !imageBaseNames.includes(image);
	});

	return { missing, unused };
}

/**
 * Download assets from Contentful.
 *
 * @param {string[]} images - List of image URLs to download.
 * @returns {Promise<void>}
 */
async function downloadContentfulAssets(images = []) {
	if (!images.length) {
		logWarn("No images to download");
		return;
	}

	try {
		logInfo("Fetching images from cms...");
		prepareDir(IMAGE_OUTPUT_PATH_RESOLVED);

		const limit = pLimit(5);
		const downloadPromises = [];
		for (const image of images) {
			const url = `https:${image}`;
			const fileName = path.basename(url);
			const outputPath = path.join(IMAGE_OUTPUT_PATH_RESOLVED, fileName);

			downloadPromises.push(
				limit(() =>
					withRetry(downloadImage, [url, outputPath], 3).then(() => {
						logDebug(`Downloaded: ${fileName}`);
					}),
				),
			);
		}

		await Promise.all(downloadPromises);
		logSuccess(`Saved ${images.length} image(s) from cms`);
	} catch (err) {
		logError("Error downloading assets:", err);
	}
}

/**
 * Download an image from a URL.
 *
 * @param {string} url - The URL of the image to download.
 * @param {string} outputPath - Path to save the downloaded image file.
 * @returns {Promise<void>}
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
				file.on("finish", () => {
					file.close((err) => {
						if (err) reject(err);
						else resolve();
					});
				});
			})
			.on("error", (err) => reject(err));
	});
}
