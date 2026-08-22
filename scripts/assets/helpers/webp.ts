const HEADER_SIZE = 12;
const METADATA_TYPES = ["ICCP", "EXIF", "XMP "];
const VP8X_ALPHA_FLAG = 0x10;
const VP8X_METADATA_FLAGS = 0x20 | 0x08 | 0x04; // ICCP | EXIF | XMP

/**
 * Checks whether WebP bytes contain transparency.
 */
export function hasWebpTransparency(
	input: Uint8Array | ArrayBufferLike,
): boolean {
	const bytes = toBytes(input);

	for (const [type, start, size] of webpChunks(bytes)) {
		if (type === "ALPH") return true;

		if (type === "VP8X") {
			if (size < 1) throw new Error("Invalid WebP: VP8X chunk too small");
			if ((bytes[start + 8] & VP8X_ALPHA_FLAG) !== 0) return true;
		}

		if (type === "VP8L") {
			if (size < 5) throw new Error("Invalid WebP: VP8L chunk too small");
			if ((readUInt32LE(bytes, start + 9) & (1 << 28)) !== 0) return true;
		}
	}

	return false;
}

/**
 * Strips ICCP, EXIF and XMP chunks from a WebP file.
 * Returns the input unchanged when there is nothing to strip.
 */
export function stripWebpMetadata(
	input: Uint8Array | ArrayBufferLike,
): Uint8Array {
	const bytes = toBytes(input);
	const output = new Uint8Array(bytes.length);
	output.set(bytes.subarray(0, HEADER_SIZE));

	let outEnd = HEADER_SIZE;
	let vp8xFlagsOffset = -1;

	for (const [type, start, size, end] of webpChunks(bytes)) {
		if (METADATA_TYPES.includes(type)) continue;

		if (type === "VP8X") {
			if (size < 1) throw new Error("Invalid WebP: VP8X chunk too small");
			vp8xFlagsOffset = outEnd + 8;
		}

		output.set(bytes.subarray(start, end), outEnd);
		outEnd += end - start;
	}

	if (outEnd === bytes.length) return bytes;

	if (vp8xFlagsOffset >= 0) output[vp8xFlagsOffset] &= ~VP8X_METADATA_FLAGS;
	writeUInt32LE(output, 4, outEnd - 8); // RIFF size covers "WEBP" + chunks

	return output.slice(0, outEnd);
}

/**
 * Iterates RIFF chunks as `[type, start, size, end]`, validating the header,
 * where `end` includes the odd-size padding byte.
 */
function* webpChunks(
	bytes: Uint8Array,
): Generator<[string, number, number, number]> {
	if (bytes.length < HEADER_SIZE) {
		throw new Error("Invalid WebP: file too small");
	}
	if (readFourCC(bytes, 0) !== "RIFF" || readFourCC(bytes, 8) !== "WEBP") {
		throw new Error("Invalid WebP: missing RIFF/WEBP header");
	}

	let offset = HEADER_SIZE;
	while (offset + 8 <= bytes.length) {
		const size = readUInt32LE(bytes, offset + 4);
		const dataEnd = offset + 8 + size;
		if (dataEnd > bytes.length) {
			throw new Error("Invalid WebP: truncated chunk");
		}

		const end = Math.min(dataEnd + (size & 1), bytes.length);
		yield [readFourCC(bytes, offset), offset, size, end];
		offset = end;
	}
}

function toBytes(input: Uint8Array | ArrayBufferLike): Uint8Array {
	return input instanceof Uint8Array ? input : new Uint8Array(input);
}

function readFourCC(bytes: Uint8Array, offset: number): string {
	return String.fromCharCode(...bytes.subarray(offset, offset + 4));
}

function readUInt32LE(bytes: Uint8Array, offset: number): number {
	return (
		(bytes[offset] |
			(bytes[offset + 1] << 8) |
			(bytes[offset + 2] << 16) |
			(bytes[offset + 3] << 24)) >>>
		0
	);
}

function writeUInt32LE(bytes: Uint8Array, offset: number, value: number): void {
	bytes[offset] = value & 0xff;
	bytes[offset + 1] = (value >>> 8) & 0xff;
	bytes[offset + 2] = (value >>> 16) & 0xff;
	bytes[offset + 3] = (value >>> 24) & 0xff;
}
