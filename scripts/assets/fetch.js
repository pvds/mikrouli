import fs from "node:fs";
import path from "node:path";
import {
	IMAGE_INPUT_PATH_RESOLVED,
	IMAGES_JSON_OUTPUT_PATH_RESOLVED,
	IS_CMS,
} from "$util/dyn";
import { prepareDir } from "$util/file";
import { pLimit } from "$util/limit";

import { logDebug, logError, logInfo, logSuccess, logWarn } from "$util/log";
import { withRetry } from "$util/retry";

if (IS_CMS)
	await syncImages(
		path.join(IMAGE_INPUT_PATH_RESOLVED, "cms"),
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
	if (!(await Bun.file(dataPath).exists())) {
		logWarn("No cms image data found");
		process.exit(0);
	}
	if (!fs.existsSync(imagesPath))
		fs.mkdirSync(imagesPath, { recursive: true });

	const cmsImages = await Bun.file(dataPath).json();
	const { missing = [], unused = [] } = checkImages(imagesPath, cmsImages);

	await downloadContentfulAssets(imagesPath, missing);
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
 * @param {string} imagesPath - The path to the unprocessed image folder.
 * @param {string[]} images - List of image URLs to download.
 * @returns {Promise<void>}
 */
async function downloadContentfulAssets(imagesPath, images = []) {
	if (!images.length) {
		logWarn("No images to download");
		return;
	}

	try {
		logInfo("Fetching images from cms...");
		prepareDir(imagesPath);

		const limit = pLimit(5);
		const downloadPromises = [];
		for (const image of images) {
			const url = `https:${image}`;
			const fileName = path.basename(url);
			const outputPath = path.join(imagesPath, fileName);

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
async function downloadImage(url, outputPath) {
	const response = await fetch(url);
	if (!response.ok)
		throw new Error(`Failed to download ${url}: ${response.status}`);
	await Bun.write(outputPath, response);
}
