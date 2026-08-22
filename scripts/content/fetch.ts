import path from "node:path";
import type { CreateClientParams } from "contentful";
import { createClient } from "contentful";
import { CONTENT_TYPES } from "$config";
import {
	CONTENTFUL_ACCESS_TOKEN,
	CONTENTFUL_SPACE_ID,
	IS_FORCE,
	IS_PROD,
} from "$util/dyn";
import { logError, logInfo, logSuccess, logWarn } from "$util/log";
import { processContentfulData } from "./process";

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
	logError(
		"Missing Contentful environment vars (CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN).",
	);
	process.exit(1);
}

const clientParams: CreateClientParams = {
	space: CONTENTFUL_SPACE_ID,
	accessToken: CONTENTFUL_ACCESS_TOKEN,
};
const client = createClient(clientParams);

async function fetchContentfulData(): Promise<void> {
	if (!IS_PROD && !IS_FORCE) {
		logWarn("Development mode. Use --force to fetch fresh data.");
		return;
	}

	try {
		logInfo("Fetching data from cms...");

		const requests = CONTENT_TYPES.map(({ content_type, order }) =>
			client.getEntries({ content_type, order }),
		);
		const results = await Promise.all(requests);

		const rawData: Record<string, unknown[]> = {};
		for (const [i, { id }] of CONTENT_TYPES.entries()) {
			rawData[id] = (results[i] as { items: unknown[] }).items;
		}

		const processedData = processContentfulData(rawData);

		const spacing = !IS_PROD ? 4 : 0;

		for (const { id } of CONTENT_TYPES) {
			const outputPath = path.resolve(
				process.cwd(),
				`src/data/generated/${id}.json`,
			);

			const contentType = processedData[id as keyof typeof processedData];
			await writeJsonFile(outputPath, contentType, spacing);
		}

		const imagesPath = path.resolve(
			process.cwd(),
			"src/data/generated/images.json",
		);
		await writeJsonFile(imagesPath, processedData.images, spacing);
		logSuccess("Fetched Contentful data");
	} catch (error) {
		if (error instanceof Error)
			logError("Error fetching cms data:", error.message);
		process.exit(1);
	}
}

async function writeJsonFile(
	filePath: string,
	data: unknown,
	spacing: number = 0,
): Promise<number> {
	return Bun.write(filePath, JSON.stringify(data, null, spacing));
}

await fetchContentfulData();
