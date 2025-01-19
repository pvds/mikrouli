import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import pLimit from "p-limit";
import sharp from "sharp";
import { logDebug, logError, logInfo, logSuccess } from "../util/log.js";

const SIZES = [1920, 1280, 640]; // Responsive sizes

const cpuCount = Math.floor(os.cpus().length / 2);
const args = process.argv.slice(2);
const isCMS = args.includes("--cms");
const isStatic = args.includes("--static");

/**
 * Process images with concurrency control using p-limit.
 * @param {string} inputDir - Input directory path.
 * @param {string} outputDir - Output directory path.
 * @param {keyof import("sharp").FormatEnum} format - Desired output image format.
 * @param {number} quality - Quality level for the format.
 * @param {number} concurrency - Maximum number of files to process concurrently.
 */
export const processImages = async (
	inputDir,
	outputDir,
	format = "webp",
	quality = 80,
	concurrency = cpuCount,
) => {
	logInfo("Optimizing images...");
	const startTime = performance.now();
	const inDir = path.resolve(process.cwd(), inputDir);
	const outDir = path.resolve(process.cwd(), outputDir);
	const limit = pLimit(concurrency);

	// Get an array of image file names that match the pattern.
	const files = fs.readdirSync(inDir).filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));

	// Remove the output directory if it exists and then re-create it.
	if (fs.existsSync(outDir)) {
		fs.rmSync(outDir, { recursive: true, force: true });
	}
	fs.mkdirSync(outDir, { recursive: true });

	// Map each file to a limited promise.
	const tasks = files.map((file) =>
		limit(async () => {
			const inputPath = path.join(inDir, file);
			try {
				// Create the Sharp instance for the file.
				const image = sharp(inputPath);

				// Process all sizes concurrently
				await Promise.all(
					SIZES.map(async (size) => {
						const outputFileName = `${path.parse(file).name}-${size}.${format}`;
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
			} catch (err) {
				logError(`Error processing file ${file}:`, err.message);
			}
		}),
	);

	// Wait until all file tasks have completed.
	await Promise.all(tasks);
	const timing = Math.round(performance.now() - startTime) / 1000;
	logSuccess(`Optimized ${files?.length} images!`);
	logDebug(`Optimizing took ${timing} seconds`);
};

if (isStatic) {
	processImages("./images/static", "./static/images/processed/static").catch((err) =>
		console.error(err),
	);
}

if (isCMS) {
	processImages("./images/cms", "./static/images/processed/cms").catch((err) =>
		console.error(err),
	);
}
