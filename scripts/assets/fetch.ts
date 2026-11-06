import fs from "node:fs";
import path from "node:path";
import {
	IMAGE_INPUT_PATH_RESOLVED,
	IMAGES_JSON_OUTPUT_PATH_RESOLVED,
	IS_CMS,
} from "#util/dyn.ts";
import { getAssetFileName, prepareDir } from "#util/file.ts";
import { pLimit } from "#util/limit.ts";
import { logDebug, logError, logInfo, logSuccess, logWarn } from "#util/log.ts";
import { withRetry } from "#util/retry.ts";

if (IS_CMS)
	await syncImages(
		path.join(IMAGE_INPUT_PATH_RESOLVED, "cms"),
		IMAGES_JSON_OUTPUT_PATH_RESOLVED,
	);

interface SyncResult {
	missing: string[];
	unused: string[];
}

export async function syncImages(
	imagesPath: string,
	dataPath: string,
): Promise<void> {
	logInfo("Syncing images with cms...");
	if (!(await Bun.file(dataPath).exists())) {
		logWarn("No cms image data found");
		process.exit(0);
	}
	if (!fs.existsSync(imagesPath))
		fs.mkdirSync(imagesPath, { recursive: true });

	const cmsImages = (await Bun.file(dataPath).json()) as string[];
	const { missing = [], unused = [] } = checkImages(imagesPath, cmsImages);

	await downloadContentfulAssets(imagesPath, missing);
	if (unused.length) deleteImages(imagesPath, unused);

	if (missing.length || unused.length) logSuccess("Synced images with cms");
	else logSuccess("No images to sync");
}

function deleteImages(imagesPath: string, images: string[] = []): void {
	logInfo("Deleting unused cms images...");
	for (const image of images) {
		const imagePath = path.join(imagesPath, image);
		fs.unlinkSync(imagePath);
		logDebug(`Deleted: ${image}`);
	}
	logSuccess(`Deleted ${images.length} unused cms image(s).`);
}

function checkImages(imagePath: string, images: string[] = []): SyncResult {
	const downloadedImages = fs.readdirSync(imagePath);
	const imageBaseNames = images.map(getAssetFileName);
	const missing = images.filter((image) => {
		const fileName = getAssetFileName(image);
		return !downloadedImages.includes(fileName);
	});
	const unused = downloadedImages.filter((image) => {
		return !imageBaseNames.includes(image);
	});

	return { missing, unused };
}

async function downloadContentfulAssets(
	imagesPath: string,
	images: string[] = [],
): Promise<void> {
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
			const url = image.startsWith("//") ? `https:${image}` : image;
			const fileName = getAssetFileName(image);
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

async function downloadImage(url: string, outputPath: string): Promise<void> {
	const response = await fetch(url);
	if (!response.ok)
		throw new Error(`Failed to download ${url}: ${response.status}`);
	await Bun.write(outputPath, response);
}
