import { promises as fs } from "node:fs";
import path from "node:path";
import {
	IMAGE_EXT,
	IMAGE_FILENAME_TEMPLATE,
	IMAGE_SIZES,
	IMAGE_SOURCE_EXTENSIONS,
} from "$config";
import {
	CPU_COUNT,
	IMAGE_INPUT_PATH_RESOLVED,
	IMAGE_OUTPUT_PATH_RESOLVED,
} from "$util/dyn";
import { directoryExists, fileExists, prepareDir } from "$util/file";
import { pLimit } from "$util/limit";
import {
	logDebug,
	logError,
	logHeader,
	logInfo,
	logMessage,
	logSuccess,
} from "$util/log";
import { measure } from "$util/measure";
import { safeIncrement } from "$util/process";
import { escapeRegex } from "$util/regex";
import { writeMetadata } from "./metadata";
import { hasWebpTransparency, stripWebpMetadata } from "./webp";

const BUN_IMAGE_OPTIONS = {
	autoOrient: false,
};

interface ProcessImagesOptions {
	quality?: number;
	concurrency?: number;
	force?: boolean;
}

interface GenerateImagesOptions {
	quality: number;
	outDir: string;
	counts: Record<string, number>;
	force: boolean;
}

export async function processImages(
	category: string,
	{
		quality = 80,
		concurrency = CPU_COUNT,
		force = false,
	}: ProcessImagesOptions = {},
): Promise<void> {
	logInfo(`Optimizing ${category} images...`);
	const startTime = performance.now();
	const inDir = path.join(IMAGE_INPUT_PATH_RESOLVED, category);
	const outDir = path.join(IMAGE_OUTPUT_PATH_RESOLVED, category);
	const limit = pLimit(concurrency);
	const metaData: Record<
		string,
		{
			width: string;
			height: string;
			hasTransparency: boolean;
		}
	> = {};
	const counts: Record<string, number> = {
		generated: 0,
		skipped: 0,
		deleted: 0,
	};

	await prepareDir(outDir);

	const files = await getImageFiles(inDir);

	const tasks = files.map((file) =>
		limit(async () => {
			const inputPath = path.join(inDir, file);
			const baseName = path.parse(file).name;
			const source = Bun.file(inputPath);
			await generateImages(source, baseName, {
				quality,
				outDir,
				counts,
				force,
			});

			const { width, height } = await source
				.image(BUN_IMAGE_OPTIONS)
				.metadata();
			if (!width || !height) {
				throw new Error(`Missing metadata dimensions for ${inputPath}`);
			}

			const transparencyProbeSize = IMAGE_SIZES.at(-1);
			if (!transparencyProbeSize) {
				throw new Error("IMAGE_SIZES cannot be empty");
			}

			const transparencyProbePath = path.join(
				outDir,
				buildFileName(
					baseName,
					transparencyProbeSize.toString(),
					IMAGE_EXT,
				),
			);

			const hasTransparency = hasWebpTransparency(
				await Bun.file(transparencyProbePath).bytes(),
			);

			metaData[baseName] = {
				width: width.toString(),
				height: height.toString(),
				hasTransparency,
			};
		}),
	);

	await Promise.all(tasks);
	await deleteStaleImages(category, counts);

	logHeader(`Optimized ${category} images`);
	logSuccess(
		`Synced optimized images from ${files.length} ${category} images`,
	);
	logMessage(`Generated ${counts.generated} new ${category} images`);
	logMessage(`Skipped ${counts.skipped} existing ${category} images`);
	logMessage(`Deleted ${counts.deleted} stale ${category} images`);
	logDebug(
		`Optimizing ${category} images took ${measure(startTime)} seconds`,
	);

	await writeMetadata(category, metaData);
}

async function generateImages(
	source: Bun.BunFile,
	baseName: string,
	{ quality, outDir, counts, force }: GenerateImagesOptions,
): Promise<void> {
	await Promise.all(
		IMAGE_SIZES.map(async (size) => {
			const outputFileName = buildFileName(
				baseName,
				size.toString(),
				IMAGE_EXT,
			);
			const outputPath = path.join(outDir, outputFileName);

			if (!force && (await fileExists(outputPath))) {
				logDebug(`Skipping existing image: ${outputFileName}`);
				safeIncrement(counts, "skipped");
				return;
			}

			try {
				await source
					.image(BUN_IMAGE_OPTIONS)
					.resize(size, undefined, {
						fit: "inside",
						withoutEnlargement: true,
					})
					.webp({
						quality,
						lossless: false,
					})
					.write(outputPath);

				// Sharp omits ICC/EXIF/XMP metadata in generated WebP output.
				// Strip equivalent chunks to keep Bun output behavior aligned.
				const generatedBytes = await Bun.file(outputPath).bytes();
				const strippedBytes = stripWebpMetadata(generatedBytes);
				if (strippedBytes.length !== generatedBytes.length) {
					await Bun.write(outputPath, strippedBytes);
				}

				logDebug(`Generated: ${outputFileName}`);
				safeIncrement(counts, "generated");
			} catch (error) {
				logError(`Failed to generate image ${outputFileName}:`, error);
				throw error;
			}
		}),
	);
}

async function deleteStaleImages(
	category: string,
	counts: Record<string, number>,
): Promise<void> {
	const inDir = path.join(IMAGE_INPUT_PATH_RESOLVED, category);
	const outDir = path.join(IMAGE_OUTPUT_PATH_RESOLVED, category);
	const processedImageRegex = createProcessedImageRegex();

	if (!(await directoryExists(outDir))) return;

	const [baseNames, outFiles] = await Promise.all([
		getBaseNames(inDir),
		fs.readdir(outDir),
	]);

	await Promise.all(
		[...outFiles].map(async (file) => {
			const match = file.match(processedImageRegex);
			if (match) {
				const [, base, size] = match;
				if (
					!baseNames.has(base) ||
					!IMAGE_SIZES.includes(Number(size))
				) {
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

async function getBaseNames(inDir: string): Promise<Set<string>> {
	const files = await fs.readdir(inDir).catch((err) => {
		logError(`Failed to read input directory ${inDir}:`, err);
		return [];
	});
	return new Set(files.map((file) => path.parse(file).name));
}

function buildFileName(base: string, size: string, ext: string): string {
	return IMAGE_FILENAME_TEMPLATE.replace("{base}", base)
		.replace("{size}", size)
		.replace("{ext}", ext);
}

function createProcessedImageRegex(): RegExp {
	return new RegExp(
		`^${escapeRegex(IMAGE_FILENAME_TEMPLATE)
			.replace("\\{base\\}", "([A-Za-z0-9-_]+)")
			.replace("\\{size\\}", "(\\d+)")
			.replace("\\{ext\\}", `(${escapeRegex(IMAGE_EXT)})`)}$`,
		"i",
	);
}

async function getImageFiles(inDir: string): Promise<string[]> {
	const fileRegex = new RegExp(
		`\\.(${IMAGE_SOURCE_EXTENSIONS.join("|")})$`,
		"i",
	);

	try {
		const allFiles = await fs.readdir(inDir);
		return allFiles.filter((file) => fileRegex.test(file));
	} catch (err) {
		logError(`Failed to read directory ${inDir}:`, err);
		return [];
	}
}
