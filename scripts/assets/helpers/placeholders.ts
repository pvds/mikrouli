import type { OutputInfo } from "sharp";
import sharp from "sharp";

export const generatePlaceholder = async (
	inputPath: string,
	outputPath: string = "",
	asBase64: boolean = true,
): Promise<string | OutputInfo | undefined> => {
	const quality = 50;
	const image = sharp(inputPath)
		.resize({ width: 16 })
		.blur()
		.toFormat("webp", { quality, alphaQuality: quality });

	if (!asBase64) {
		await image.toFile(outputPath);
	} else {
		const buffer = await image.toBuffer();
		return `data:image/webp;base64,${buffer.toString("base64")}`;
	}
};
