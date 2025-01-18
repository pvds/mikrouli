const sharp = require("sharp");
const fs = require("node:fs");
const path = require("node:path");

const INPUT_DIR = "./images";
const OUTPUT_DIR = "./static/images/generated";
const SIZES = [1920, 1280, 640]; // Responsive sizes

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

const processImages = async (inputDir, outputDir, format, quality) => {
	const dir = path.resolve(inputDir);
	// Ensure we get an array of file names.
	const files = fs.readdirSync(dir).filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));

	for (const file of files) {
		const inputPath = path.join(dir, file);
		try {
			// Create the initial image instance
			const image = sharp(inputPath);

			// Extract metadata for the aspect ratio
			const metadata = await image.metadata();
			const divisor = gcd(metadata.width, metadata.height);
			const aspectRatio = `${metadata.width / divisor}:${metadata.height / divisor}`;

			// Process all sizes concurrently using Promise.all and clone the image for each size.
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
	}
};

processImages(INPUT_DIR, OUTPUT_DIR, "webp", 80);
