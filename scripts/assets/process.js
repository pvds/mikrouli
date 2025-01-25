import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { IMAGE_EXTENSIONS, IMAGE_SIZES } from "$const";
import pLimit from "p-limit";
import sharp from "sharp";
import { prepareDir } from "../util/file.js";
import { logDebug, logError, logInfo, logSuccess } from "../util/log.js";
import { measure } from "../util/measure.js";
import { generatePlaceholder, writePlaceholders } from "../util/placeholders.js";

const cpuCount = Math.floor(os.cpus().length / 2);
const args = process.argv.slice(2);
const isCMS = args.includes("--cms");
const isLocal = args.includes("--local");

// Use regex to match valid image extensions and sizes
const fileRegex = new RegExp(`\.(${IMAGE_EXTENSIONS.join("|")})$`, "i");
const processedImageRegex = new RegExp(`^(.*)-(${IMAGE_SIZES.join("|")})\.(webp)$`, "i");

const INPUT_DIR = "./images";
const OUTPUT_DIR = "./static/images";

/**
 * Generate resized images for different sizes.
 * @param {sharp.Sharp} image - Sharp instance of the image.
 * @param {string} baseName - Base name of the image file.
 * @param {keyof sharp.format | sharp.AvailableFormatInfo} format - Desired output image format.
 * @param {number} quality - Quality level for the format.
 * @param {string} outDir - Output directory path.
 */
const generateImages = async (image, baseName, format, quality, outDir) => {
	await Promise.all(
		IMAGE_SIZES.map(async (size) => {
			const outputFileName = `${baseName}-${size}.${format}`;
			const outputPath = path.join(outDir, outputFileName);

			if (fs.existsSync(outputPath)) {
				logDebug(`Skipping existing image: ${outputFileName}`);
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
		}),
	);
};

/**
 * Delete stale generated images without a corresponding base image asynchronously.
 * @param {string} category - The category of images to check.
 */
const deleteStaleImages = async (category) => {
	const inDir = path.resolve(process.cwd(), INPUT_DIR, category);
	const outDir = path.resolve(process.cwd(), OUTPUT_DIR, category);

	if (!fs.existsSync(outDir)) return;

	// Get the list of base image names (without extensions)
	const baseImageFiles = new Set(
		fs
			.readdirSync(inDir)
			.filter((file) => fileRegex.test(file))
			.map((file) => path.parse(file).name),
	);

	const optimizedFiles = fs.readdirSync(outDir);

	for (const file of optimizedFiles) {
		const match = file.match(processedImageRegex);

		if (match) {
			const baseName = match[1]; // Extract base name before the size suffix
			if (!baseImageFiles.has(baseName)) {
				const filePath = path.join(outDir, file);
				fs.unlinkSync(filePath);
				logInfo(`Deleted stale optimized image: ${filePath}`);
			}
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
				await generateImages(image, baseName, format, quality, outDir);
				placeholders[baseName] = await generatePlaceholder(inputPath);
			} catch (err) {
				logError(`Error processing file ${file}:`, err.message);
			}
		}),
	);

	// Wait until all file tasks have completed.
	await Promise.all(tasks);
	writePlaceholders(category, placeholders, placeholdersFile);
	await deleteStaleImages(category);

	logSuccess(`Optimized ${files.length} images`);
	logDebug(`Optimizing took ${measure(startTime)} seconds`);
};

// Execute processing based on command-line args
if (isLocal) processImages("local").catch((err) => logError(err));
if (isCMS) processImages("cms").catch((err) => logError(err));
