import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import pLimit from "p-limit";
import sharp from "sharp";

const SIZES = [1920, 1280, 640]; // Responsive sizes

const cpuCount = Math.floor(os.cpus().length / 2);

// Euclidean algorithm for greatest common divisor
const gcd = (a, b) => {
	// biome-ignore lint/style/noParameterAssign: more clear than using local variables
	while (b) [a, b] = [b, a % b];
	return a;
};

/**
 * Process images with concurrency control using p-limit.
 * @param {string} inputDir - Input directory path.
 * @param {string} outputDir - Output directory path.
 * @param {keyof import("sharp").FormatEnum} format - Desired output image format.
 * @param {number} quality - Quality level for the format.
 * @param {number} concurrency - Maximum number of files to process concurrently.
 */
const processImages = async (inputDir, outputDir, format, quality, concurrency = cpuCount) => {
	const limit = pLimit(concurrency);

	// Get an array of image file names that match the pattern.
	const files = fs.readdirSync(inputDir).flatMap(
		(folder) =>
			fs
				.readdirSync(path.join(inputDir, folder)) // Read contents of each folder
				.filter((file) => /\.(jpg|jpeg|png)$/i.test(file)) // Filter image files
				.map((file) => path.join(folder, file)), // Correct path construction
	);

	// Remove the output directory if it exists and then re-create it.
	if (fs.existsSync(outputDir)) {
		fs.rmSync(outputDir, { recursive: true, force: true });
	}
	fs.mkdirSync(outputDir, { recursive: true });

	// Map each file to a limited promise.
	const tasks = files.map((file) =>
		limit(async () => {
			const inputPath = path.join(inputDir, file);
			try {
				// Create the Sharp instance for the file.
				const image = sharp(inputPath);

				// Get metadata and calculate the simplest integer aspect ratio.
				// TODO: decide whether to use aspect ratio in file names
				// const metadata = await image.metadata();
				// const divisor = gcd(metadata.width, metadata.height);
				// const aspectRatio = `${metadata.width / divisor}:${metadata.height / divisor}`;

				// Process all sizes concurrently
				await Promise.all(
					SIZES.map(async (size) => {
						const outputFileName = `${path.parse(file).name}-${size}.${format}`;
						const outputPath = path.join(outputDir, outputFileName);

						await image
							.clone()
							.resize({
								width: size,
								fit: sharp.fit.inside,
								withoutEnlargement: true, // Avoid enlarging images
							})
							.toFormat(format, { quality })
							.toFile(outputPath);

						console.log(`Generated: ${outputFileName}`);
					}),
				);
			} catch (err) {
				console.error(`Error processing file ${file}:`, err.message);
			}
		}),
	);

	// Wait until all file tasks have completed.
	await Promise.all(tasks);
};

const startTime = performance.now();
processImages("./images", "./static/images/processed", "webp", 80)
	.then(() => {
		const timing = Math.round(performance.now() - startTime) / 1000;
		console.log("Finished processing images");
		console.log(`Processing took ${timing} seconds`);
	})
	.catch((err) => console.error(err));
