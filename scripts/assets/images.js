import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import pLimit from "p-limit";
import sharp from "sharp";
import { IMAGE_EXTENSIONS, IMAGE_SIZES } from "../../src/const.js";
import { logDebug, logError, logInfo, logSuccess } from "../util/log.js";

const cpuCount = Math.floor(os.cpus().length / 2);
const args = process.argv.slice(2);
const isCMS = args.includes("--cms");
const isStatic = args.includes("--static");
const fileRegex = new RegExp(`\\.(${IMAGE_EXTENSIONS.join("|")})$`, "i");
const useBase64Placeholders = true;

const INPUT_DIR = "./images";
const OUTPUT_DIR = "./static/images/processed";

/**
 * Generate a small blurred placeholder image.
 * @param {string} inputPath - The path to the original image.
 * @param {string} outputPath - The path to save the placeholder (if provided).
 * @param {boolean} asBase64 - Whether to return the image as a base64 string.
 * @returns {Promise<sharp.OutputInfo>|string} - Base64 string if `asBase64` is true, otherwise
 * saves to file.
 */
const generatePlaceholder = async (inputPath, outputPath = "", asBase64 = true) => {
	const quality = 50;
	const image = sharp(inputPath)
		.resize({ width: 16 })
		.blur()
		.toFormat("webp", { quality, alphaQuality: quality });

	if (asBase64) {
		// Convert to buffer and return as base64 string
		const buffer = await image.toBuffer();
		return `data:image/webp;base64,${buffer.toString("base64")}`;
	}
	await image.toFile(outputPath);
};

/**
 * Overwrite placeholders for a specific category in the JSON file.
 * @param {string} category - The category key (e.g., "cms" or "static").
 * @param {Object} placeholders - An object containing new image placeholders.
 * @param {string} outputPath - Path to the placeholders JSON file.
 */
const writePlaceholders = (category, placeholders, outputPath) => {
	let data = {};

	// Read existing JSON if the file exists
	if (fs.existsSync(outputPath)) {
		data = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
	}

	// Overwrite the entire category with new placeholders
	data[category] = placeholders;

	// Write the updated JSON to file (overwrite entire file)
	fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

	logInfo(`Successfully wrote placeholders under "${category}"`);
};

/**
 * Process images with concurrency control using p-limit.
 * @param {string} category - The category of images to process.
 * @param {keyof import("sharp").FormatEnum} format - Desired output image format.
 * @param {number} quality - Quality level for the format.
 * @param {number} concurrency - Maximum number of files to process concurrently.
 */
export const processImages = async (
	category,
	format = "webp",
	quality = 80,
	concurrency = cpuCount,
) => {
	logInfo("Optimizing images...");
	const startTime = performance.now();
	const inDir = path.resolve(process.cwd(), INPUT_DIR, category);
	const outDir = path.resolve(process.cwd(), OUTPUT_DIR, category);
	const limit = pLimit(concurrency);
	const placeholdersFile = path.resolve(process.cwd(), "data/placeholders.json");
	const placeholders = {};

	// Get an array of image file names that match the pattern.
	const files = fs.readdirSync(inDir).filter((file) => fileRegex.test(file));

	// Remove the output directory if it exists and then re-create it.
	if (fs.existsSync(outDir)) {
		fs.rmSync(outDir, { recursive: true, force: true });
	}
	fs.mkdirSync(outDir, { recursive: true });

	// Map each file to a limited promise.
	const tasks = files.map((file) =>
		limit(async () => {
			const inputPath = path.join(inDir, file);
			const baseName = path.parse(file).name;

			try {
				// Create the Sharp instance for the file.
				const image = sharp(inputPath);

				// Process normal images
				await Promise.all(
					IMAGE_SIZES.map(async (size) => {
						const outputFileName = `${baseName}-${size}.${format}`;
						const outputPath = path.join(outDir, outputFileName);

						await image
							.clone()
							.resize({
								width: size,
								fit: sharp.fit.inside,
								withoutEnlargement: true, // Avoid enlarging images
							})
							.toFormat(format, { quality })
							.toFile(outputPath);

						logDebug(`Generated: ${outputFileName}`);
					}),
				);

				// Generate the tiny blurred placeholder
				const placeholderPath = path.join(outDir, `${baseName}-placeholder.webp`);

				if (useBase64Placeholders) {
					placeholders[baseName] = await generatePlaceholder(inputPath);
				} else {
					await generatePlaceholder(inputPath, placeholderPath, useBase64Placeholders);
				}
			} catch (err) {
				logError(`Error processing file ${file}:`, err.message);
			}
		}),
	);

	// Wait until all file tasks have completed.
	await Promise.all(tasks);
	if (useBase64Placeholders) writePlaceholders(category, placeholders, placeholdersFile);
	const timing = Math.round(performance.now() - startTime) / 1000;
	logSuccess(`Optimized ${files?.length} images!`);
	logDebug(`Optimizing took ${timing} seconds`);
};

if (isStatic) processImages("static").catch((err) => console.error(err));
if (isCMS) processImages("cms").catch((err) => console.error(err));
