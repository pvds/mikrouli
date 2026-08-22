import path from "node:path";
import { IMAGES_METADATA_OUTPUT_PATH_RESOLVED } from "$util/dyn.js";
import { prepareDir, readJSON, writeJSON } from "$util/file.js";
import { logInfo, logSuccess } from "$util/log.js";

interface ImageMeta {
	width: string;
	height: string;
	hasTransparency: boolean;
}

type Metadata = Record<string, ImageMeta>;

export const writeMetadata = async (
	category: string,
	metadata: Metadata,
): Promise<void> => {
	logInfo(`\nWriting ${category} images metadata...`);

	const outputPath = path.join(
		IMAGES_METADATA_OUTPUT_PATH_RESOLVED,
		category,
	);
	const outputMetadataPath = path.join(
		IMAGES_METADATA_OUTPUT_PATH_RESOLVED,
		"images.json",
	);
	prepareDir(outputPath, true);

	const metadataFileContents = (await readJSON(outputMetadataPath)) as Record<
		string,
		Metadata
	>;
	metadataFileContents[category] = Object.fromEntries(
		Object.entries(metadata).sort(),
	);

	await Promise.all(
		Object.entries(metadata).map(async ([imageName, meta]) => {
			const filePath = path.join(outputPath, `${imageName}.json`);
			await writeJSON(filePath, meta);
		}),
	);

	await writeJSON(outputMetadataPath, metadataFileContents);

	logSuccess(`Wrote ${category} images metadata`);
};
