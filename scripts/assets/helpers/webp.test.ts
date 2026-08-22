import { describe, expect, it } from "bun:test";
import path from "node:path";
import { hasWebpTransparency, stripWebpMetadata } from "./webp";

const ROOT = path.resolve(import.meta.dir, "../../..");
const VP8X_METADATA_FLAGS = 0x20 | 0x08 | 0x04;

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
});

describe("stripWebpMetadata", () => {
	it("strips ICC metadata chunk and clears VP8X metadata flags", async () => {
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

		expect(inspect(bytes).types).toContain("ICCP");
		expect(inspect(stripped).types).not.toContain("ICCP");
		expect(inspect(bytes).vp8xFlags & VP8X_METADATA_FLAGS).not.toBe(0);
		expect(inspect(stripped).vp8xFlags & VP8X_METADATA_FLAGS).toBe(0);
		expect(stripped.length).toBeLessThan(bytes.length);
		expect(hasWebpTransparency(stripped)).toBe(hasWebpTransparency(bytes));
	});

	it("returns bytes unchanged when no metadata chunks exist", async () => {
		const bytes = await Bun.file(
			path.join(
				ROOT,
				"static/images/cms/pexels-fauxels-3228726-1920.webp",
			),
		).bytes();
		const stripped = stripWebpMetadata(bytes);

		expect(stripped).toBe(bytes);
	});

	it("throws for invalid input", () => {
		expect(() => stripWebpMetadata(new Uint8Array([1, 2, 3]))).toThrow(
			"Invalid WebP: file too small",
		);
	});
});

function inspect(bytes: Uint8Array): { types: string[]; vp8xFlags: number } {
	const types: string[] = [];
	let vp8xFlags = 0;
	let offset = 12;

	while (offset + 8 <= bytes.length) {
		const type = String.fromCharCode(...bytes.subarray(offset, offset + 4));
		const size =
			(bytes[offset + 4] |
				(bytes[offset + 5] << 8) |
				(bytes[offset + 6] << 16) |
				(bytes[offset + 7] << 24)) >>>
			0;

		types.push(type);
		if (type === "VP8X") vp8xFlags = bytes[offset + 8] ?? 0;
		offset += 8 + size + (size & 1);
	}

	return { types, vp8xFlags };
}
