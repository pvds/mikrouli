import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { IMAGE_EXTENSIONS, IMAGE_SIZES } from "$const";
import pLimit from "p-limit";
import sharp from "sharp";
import { prepareDir } from "../util/file.js";
import { logDebug, logError, logHeader, logInfo, logMessage, logSuccess } from "../util/log.js";
import { measure } from "../util/measure.js";
import { generatePlaceholder, writePlaceholders } from "../util/placeholders.js";
import { escapeRegex } from "../util/regex.js";

const cpuCount = Math.floor(os.cpus().length / 2);
const args = process.argv.slice(2);
const isCMS = args.includes("--cms");
const isLocal = args.includes("--local");

const INPUT_DIR = "./images";
const OUTPUT_DIR = "./static/images";
const FILENAME_TEMPLATE = "{base}-{size}.{ext}";

// Use regex to match valid image extensions and sizes
const fileRegex = new RegExp(`\.(${IMAGE_EXTENSIONS.join("|")})$`, "i");

/**
 * Generates a filename based on the template.
 * @param {string} base - Base filename without extension.
 * @param {string} size - Image width.
 * @param {string} ext - Image format (e.g., webp).
 * @returns {string} - Formatted filename.
 */
const buildFileName = (base, size, ext) =>
	FILENAME_TEMPLATE.replace("{base}", base).replace("{size}", size).replace("{ext}", ext);

/**
 * Creates a regex to match filenames based on the template.
 */
const processedImageRegex = new RegExp(
	`^${escapeRegex(FILENAME_TEMPLATE)
		.replace("\\{base\\}", "([A-Za-z0-9-]+)") // Restrictive base pattern
		.replace("\\{size\\}", "(\\d+)")
		.replace("\\{ext\\}", `(${IMAGE_EXTENSIONS.join("|")})`)}$`,
	"i",
);

/**
 * Generate resized images for different sizes.
 * @param {sharp.Sharp} image - Sharp instance of the image.
 * @param {string} baseName - Base name of the image file.
 * @param {keyof sharp.format | sharp.AvailableFormatInfo} format - Desired output image format.
 * @param {number} quality - Quality level for the format.
 * @param {string} outDir - Output directory path.
 * @param {Object} counts - Object to keep track of generated images count.
 */
const generateImages = async (image, baseName, format, quality, outDir, counts) => {
	await Promise.all(
		IMAGE_SIZES.map(async (size) => {
			const outputFileName = buildFileName(baseName, size.toString(), format.toString());
			const outputPath = path.join(outDir, outputFileName);

			if (fs.existsSync(outputPath)) {
				logDebug(`Skipping existing image: ${outputFileName}`);
				counts.skipped += 1;
				return;
			}

			await image
				.clone()
				.resize({
					width: size,
					fit: sharp.fit.inside,
					withoutEnlargement: true,
				})
				.toFormat(format, { quality })
				.toFile(outputPath);
			logDebug(`Generated: ${outputFileName}`);
			counts.generated += 1;
		}),
	);
};

/**
 * Delete stale generated images without a corresponding base image asynchronously.
 * @param {string} category - The category of images to check.
 * @param {Object} counts - Object to keep track of deleted images count.
 */
const deleteStaleImages = async (category, counts) => {
	const inDir = path.resolve(INPUT_DIR, category);
	const outDir = path.resolve(OUTPUT_DIR, category);

	if (!fs.existsSync(outDir)) return;

	const baseNames = new Set(fs.readdirSync(inDir).map((file) => path.parse(file).name));

	for (const file of fs.readdirSync(outDir)) {
		const match = file.match(processedImageRegex);
		if (match) {
			const [, base, size, ext] = match;
			if (!baseNames.has(base) || !IMAGE_SIZES.includes(Number(size))) {
				fs.unlinkSync(path.join(outDir, file));
				console.info(`Deleted stale: ${file}`);
				counts.deleted += 1;
			}
		} else {
			// Delete files not matching the pattern
			fs.unlinkSync(path.join(outDir, file));
			console.info(`Deleted stale (pattern mismatch): ${file}`);
			counts.deleted += 1;
		}
	}
};

/**
 * Process images with concurrency control using p-limit.
 * @param {string} category - The category of images to process.
 * @param {keyof import("sharp").FormatEnum | sharp.AvailableFormatInfo} format - Desired output image format.
 * @param {number} quality - Quality level for the format.
 * @param {number} concurrency - Maximum number of files to process concurrently.
 */
export const processImages = async (
	category,
	format = "webp",
	quality = 80,
	concurrency = cpuCount,
) => {
	logInfo(`Optimizing ${category} images...`);
	const startTime = performance.now();
	const inDir = path.resolve(process.cwd(), INPUT_DIR, category);
	const outDir = path.resolve(process.cwd(), OUTPUT_DIR, category);
	const limit = pLimit(concurrency);
	const placeholdersFile = path.resolve(process.cwd(), "src/data/generated/placeholders.json");
	const placeholders = {};

	// Initialize counters
	const counts = { generated: 0, skipped: 0, deleted: 0 };

	// Get an array of image file names that match the pattern.
	if (!fs.existsSync(inDir)) {
		logError(`Directory not found: ${inDir}, skipping image optimization...`);
		return;
	}
	const files = fs.readdirSync(inDir).filter((file) => fileRegex.test(file));

	// Ensure output directory is clean and exists
	prepareDir(outDir);

	const tasks = files.map((file) =>
		limit(async () => {
			const inputPath = path.join(inDir, file);
			const baseName = path.parse(file).name;

			try {
				const image = sharp(inputPath);
				await generateImages(image, baseName, format, quality, outDir, counts);
				placeholders[baseName] = await generatePlaceholder(inputPath);
			} catch (err) {
				logError(`Error processing file ${file}:`, err.message);
			}
		}),
	);

	// Wait until all file tasks have completed.
	await Promise.all(tasks);
	await deleteStaleImages(category, counts);

	logHeader(`Optimized ${category} images`);
	logSuccess(`Synced optimized images from ${files.length} ${category} images`);
	logMessage(`Generated ${counts.generated} new ${category} images`);
	logMessage(`Skipped ${counts.skipped} existing ${category} images`);
	logMessage(`Deleted ${counts.deleted} stale ${category} images`);
	logDebug(`Optimizing ${category} images took ${measure(startTime)} seconds`);

	writePlaceholders(category, placeholders, placeholdersFile);
};

// Execute processing based on command-line args
if (isLocal) processImages("local").catch((err) => logError(err));
if (isCMS) processImages("cms").catch((err) => logError(err));
