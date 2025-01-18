const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");
const pLimit = require("p-limit").default;
const os = require("node:os");

const INPUT_DIR = "./images";
const OUTPUT_DIR = "./static/images/generated";
const SIZES = [1920, 1280, 640]; // Responsive sizes

const cpuCount = os.cpus().length;

// Euclidean algorithm for greatest common divisor
const gcd = (a, b) => {
	// biome-ignore lint/style/noParameterAssign: more clear than using local variables
	while (b) [a, b] = [b, a % b];
	return a;
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

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
	const dir = path.resolve(inputDir);

	// Get an array of image file names that match the pattern.
	const files = fs.readdirSync(dir).filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

	// Map each file to a limited promise.
	const tasks = files.map((file) =>
		limit(async () => {
			const inputPath = path.join(dir, file);
			try {
				// Create the Sharp instance for the file.
				const image = sharp(inputPath);

				// Get metadata and calculate the simplest integer aspect ratio.
				const metadata = await image.metadata();
				const divisor = gcd(metadata.width, metadata.height);
				const aspectRatio = `${metadata.width / divisor}:${metadata.height / divisor}`;

				// Process all sizes concurrently using Promise.all.
				await Promise.all(
					SIZES.map(async (size) => {
						const outputFileName = `${path.parse(file).name}-${size}-${aspectRatio}.${format}`;
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

const startPerf = performance.now();
processImages(INPUT_DIR, OUTPUT_DIR, "webp", 80)
	.then(() => {
		const endPerf = performance.now();
		console.log("Finished processing images");
		console.log(`Processing took ${Math.round(endPerf - startPerf) / 1000} seconds`);
	})
	.catch((err) => console.error(err));
