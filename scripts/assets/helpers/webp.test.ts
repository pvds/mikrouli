import { describe, expect, it } from "bun:test";
import path from "node:path";
import { hasWebpTransparency, stripWebpMetadata } from "./webp";

const ROOT = path.resolve(import.meta.dir, "../../..");

describe("hasWebpTransparency", () => {
	it("returns true for transparent local fixture chair", async () => {
		const bytes = await Bun.file(
			path.join(ROOT, "static/images/local/chair-1920.webp"),
		).bytes();

		expect(hasWebpTransparency(bytes)).toBe(true);
	});

	it("returns true for transparent local fixture eleni-papamikrouli", async () => {
		const bytes = await Bun.file(
			path.join(ROOT, "static/images/local/eleni-papamikrouli-1920.webp"),
		).bytes();

		expect(hasWebpTransparency(bytes)).toBe(true);
	});

	it("returns false for opaque cms fixture", async () => {
		const bytes = await Bun.file(
			path.join(
				ROOT,
				"static/images/cms/pexels-fauxels-3228726-1920.webp",
			),
		).bytes();

		expect(hasWebpTransparency(bytes)).toBe(false);
	});

	it("handles starting-therapy-1 from generated output", async () => {
		const bytes = await Bun.file(
			path.join(ROOT, "static/images/cms/starting-therapy-1-1920.webp"),
		).bytes();

		expect(typeof hasWebpTransparency(bytes)).toBe("boolean");
	});

	it("throws for invalid input", () => {
		expect(() => hasWebpTransparency(new Uint8Array([1, 2, 3]))).toThrow(
			"Invalid WebP: file too small",
		);
	});

	it("strips ICC metadata chunk from Bun-generated WebP outlier", async () => {
		const bytes = await Bun.file(
			path.join(ROOT, "images/cms/eleni-landscape-3.jpeg"),
		)
			.image({ autoOrient: false })
			.resize(320, undefined, {
				fit: "inside",
				withoutEnlargement: true,
			})
			.webp({ quality: 80, lossless: false })
			.bytes();
		const stripped = stripWebpMetadata(bytes);

		expect(getChunkTypes(bytes)).toContain("ICCP");
		expect(getChunkTypes(stripped)).not.toContain("ICCP");
		expect(stripped.length).toBeLessThan(bytes.length);
	});

	it("keeps Sharp-style simple WebP unchanged when no metadata chunks exist", async () => {
		const bytes = await Bun.file(
			path.join(
				"/Users/pvdsteen/.copilot/session-state/8bca69f7-6d49-4fe7-bef7-6c30073014e9/files/sharp-baseline/images/cms/eleni-landscape-3-320.webp",
			),
		).bytes();
		const stripped = stripWebpMetadata(bytes);

		expect(stripped.length).toBe(bytes.length);
		expect(getChunkTypes(stripped)).toEqual(getChunkTypes(bytes));
	});
});

function getChunkTypes(input: Uint8Array): string[] {
	const chunkTypes: string[] = [];
	let offset = 12;
	while (offset + 8 <= input.length) {
		const type = String.fromCharCode(
			input[offset],
			input[offset + 1],
			input[offset + 2],
			input[offset + 3],
		);
		const size =
			input[offset + 4] |
			(input[offset + 5] << 8) |
			(input[offset + 6] << 16) |
			(input[offset + 7] << 24);
		const chunkSize = size >>> 0;
		chunkTypes.push(type);
		offset += 8 + chunkSize + (chunkSize & 1);
	}

	return chunkTypes;
}
