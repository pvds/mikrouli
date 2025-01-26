import { promises as fs } from "node:fs";
import path from "node:path";
import { IMAGE_SIZES } from "$lib/const.js";
import pLimit from "p-limit";
import sharp from "sharp";
import {
	CPU_COUNT,
	IMAGE_EXTENSIONS,
	IMAGE_FILENAME_TEMPLATE,
	IMAGE_INPUT_PATH_RESOLVED,
	IMAGE_OUTPUT_PATH_RESOLVED,
} from "../../util/const.js";
import { directoryExists, fileExists, prepareDir } from "../../util/file.js";
import { logDebug, logError, logHeader, logInfo, logMessage, logSuccess } from "../../util/log.js";
import { measure } from "../../util/measure.js";
import { safeIncrement } from "../../util/process.js";
import { escapeRegex } from "../../util/regex.js";
import { generatePlaceholder, writePlaceholders } from "./placeholders.js";

/**
 * Main function to process images.
 * @param {string} category - The category of images to process.
 * @param {Object} options - Options for processing images.
 * @param {keyof sharp.format | sharp.AvailableFormatInfo} [options.format='webp'] - Desired output image format.
 * @param {number} [options.quality=80] - Quality level for the format.
 * @param {number} [options.concurrency=CPU_COUNT] - Maximum number of concurrent operations.
 * @param {boolean} [options.force=false] - Whether to force overwriting existing images.
 */
export async function processImages(
	category,
	{ format = "webp", quality = 80, concurrency = CPU_COUNT, force = false } = {},
) {
	logInfo(`Optimizing ${category} images...`);
	const startTime = performance.now();
	const inDir = path.join(IMAGE_INPUT_PATH_RESOLVED, category);
	const outDir = path.join(IMAGE_OUTPUT_PATH_RESOLVED, category);
	const limit = pLimit(concurrency);
	const placeholders = {};
	const counts = { generated: 0, skipped: 0, deleted: 0 };

	await prepareDir(outDir);

	const files = await getImageFiles(inDir);

	const tasks = files.map((file) =>
		limit(async () => {
			const inputPath = path.join(inDir, file);
			const baseName = path.parse(file).name;
			const image = sharp(inputPath);
			await generateImages(image, baseName, { format, quality, outDir, counts, force });
			placeholders[baseName] = await generatePlaceholder(inputPath);
		}),
	);

	await Promise.all(tasks);
	await deleteStaleImages(category, counts);

	logHeader(`Optimized ${category} images`);
	logSuccess(`Synced optimized images from ${files.length} ${category} images`);
	logMessage(`Generated ${counts.generated} new ${category} images`);
	logMessage(`Skipped ${counts.skipped} existing ${category} images`);
	logMessage(`Deleted ${counts.deleted} stale ${category} images`);
	logDebug(`Optimizing ${category} images took ${measure(startTime)} seconds`);

	await writePlaceholders(category, placeholders);
}

/**
 * Generates resized images for different sizes.
 * @param {sharp.Sharp} image - Sharp instance of the image.
 * @param {string} baseName - Base name of the image file.
 * @param {Object} options - Options for generating images.
 * @param {keyof sharp.format | sharp.AvailableFormatInfo} options.format - Desired output image format.
 * @param {number} options.quality - Quality level for the format.
 * @param {string} options.outDir - Output directory path.
 * @param {Object} options.counts - Object to keep track of generated images count.
 * @param {boolean} options.force - Whether to force overwriting existing images.
 */
async function generateImages(image, baseName, { format, quality, outDir, counts, force }) {
	await Promise.all(
		IMAGE_SIZES.map(async (size) => {
			const outputFileName = buildFileName(baseName, size.toString(), format.toString());
			const outputPath = path.join(outDir, outputFileName);

			if (!force && (await fileExists(outputPath))) {
				logDebug(`Skipping existing image: ${outputFileName}`);
				safeIncrement(counts, "skipped");
				return;
			}

			await image
				.clone()
				.resize({ width: size, fit: sharp.fit.inside, withoutEnlargement: true })
				.toFormat(format, { quality })
				.toFile(outputPath)
				.then(() => {
					logDebug(`Generated: ${outputFileName}`);
					safeIncrement(counts, "generated");
				})
				.catch((error) => {
					logError(`Failed to generate image ${outputFileName}:`, error);
				});
		}),
	);
}

/**
 * Deletes stale generated images without a corresponding base image.
 * @param {string} category - The category of images to check.
 * @param {Object} counts - Object to keep track of deleted images count.
 */
async function deleteStaleImages(category, counts) {
	const inDir = path.join(IMAGE_INPUT_PATH_RESOLVED, category);
	const outDir = path.join(IMAGE_OUTPUT_PATH_RESOLVED, category);
	const processedImageRegex = createProcessedImageRegex();

	if (!(await directoryExists(outDir))) return;

	const [baseNames, outFiles] = await Promise.all([getBaseNames(inDir), fs.readdir(outDir)]);

	await Promise.all(
		[...outFiles].map(async (file) => {
			const match = file.match(processedImageRegex);
			if (match) {
				const [, base, size] = match;
				if (!baseNames.has(base) || !IMAGE_SIZES.includes(Number(size))) {
					await fs.unlink(path.join(outDir, file));
					console.info(`Deleted stale: ${file}`);
					safeIncrement(counts, "deleted");
					counts.deleted++;
				}
			} else {
				await fs.unlink(path.join(outDir, file));
				console.info(`Deleted stale (pattern mismatch): ${file}`);
				safeIncrement(counts, "deleted");
			}
		}),
	);
}

/**
 * Retrieves a set of base names from the input directory.
 * @param {string} inDir - Input directory path.
 * @returns {Promise<Set<string>>} - Set of base file names.
 */
async function getBaseNames(inDir) {
	const files = await fs.readdir(inDir).catch((err) => {
		logError(`Failed to read input directory ${inDir}:`, err);
		return [];
	});
	return new Set(files.map((file) => path.parse(file).name));
}

/**
 * Generates a filename based on the template.
 * @param {string} base - Base filename without extension.
 * @param {string} size - Image width.
 * @param {string} ext - Image format (e.g., webp).
 * @returns {string} - Formatted filename.
 */
function buildFileName(base, size, ext) {
	return IMAGE_FILENAME_TEMPLATE.replace("{base}", base)
		.replace("{size}", size)
		.replace("{ext}", ext);
}

/**
 * Creates a regex to match filenames based on the template.
 * @returns {RegExp} - Compiled regular expression.
 */
function createProcessedImageRegex() {
	return new RegExp(
		`^${escapeRegex(IMAGE_FILENAME_TEMPLATE)
			.replace("\\{base\\}", "([A-Za-z0-9-_]+)")
			.replace("\\{size\\}", "(\\d+)")
			.replace("\\{ext\\}", `(${IMAGE_EXTENSIONS.join("|")})`)}$`,
		"i",
	);
}

/**
 * Retrieves image files from the input directory.
 * @param {string} inDir - Input directory path.
 * @returns {Promise<string[]>} - Array of image file names.
 */
async function getImageFiles(inDir) {
	const fileRegex = new RegExp(`\\.(${IMAGE_EXTENSIONS.join("|")})$`, "i");

	try {
		const allFiles = await fs.readdir(inDir);
		return allFiles.filter((file) => fileRegex.test(file));
	} catch (err) {
		logError(`Failed to read directory ${inDir}:`, err);
		return [];
	}
}
