/**
 * Checks whether WebP bytes contain transparency.
 */
export function hasWebpTransparency(
	input: Uint8Array | ArrayBufferLike,
): boolean {
	const bytes = toBytes(input);

	if (bytes.length < 12) {
		throw new Error("Invalid WebP: file too small");
	}

	if (readFourCC(bytes, 0) !== "RIFF" || readFourCC(bytes, 8) !== "WEBP") {
		throw new Error("Invalid WebP: missing RIFF/WEBP header");
	}

	let offset = 12;
	while (offset + 8 <= bytes.length) {
		const chunkType = readFourCC(bytes, offset);
		const chunkSize = readUInt32LE(bytes, offset + 4);
		const payloadStart = offset + 8;
		const payloadEnd = payloadStart + chunkSize;

		if (payloadEnd > bytes.length) {
			throw new Error("Invalid WebP: truncated chunk");
		}

		if (chunkType === "VP8X") {
			if (chunkSize < 1) {
				throw new Error("Invalid WebP: VP8X chunk too small");
			}

			const featureFlags = bytes[payloadStart];
			if ((featureFlags & 0x10) !== 0) return true;
		}

		if (chunkType === "ALPH") return true;

		if (chunkType === "VP8L") {
			if (chunkSize < 5) {
				throw new Error("Invalid WebP: VP8L chunk too small");
			}

			const bits = readUInt32LE(bytes, payloadStart + 1);
			if ((bits & (1 << 28)) !== 0) return true;
		}

		offset = payloadEnd + (chunkSize & 1);
	}

	return false;
}

/**
 * Strips metadata chunks from a WebP file.
 * Removes: ICCP, EXIF, XMP.
 */
export function stripWebpMetadata(
	input: Uint8Array | ArrayBufferLike,
): Uint8Array {
	const bytes = toBytes(input);
	assertWebpHeader(bytes);

	const keptChunks: Uint8Array[] = [];
	let offset = 12;
	let vp8xFlagsOffset = -1;

	while (offset + 8 <= bytes.length) {
		const chunkType = readFourCC(bytes, offset);
		const chunkSize = readUInt32LE(bytes, offset + 4);
		const payloadStart = offset + 8;
		const payloadEnd = payloadStart + chunkSize;

		if (payloadEnd > bytes.length) {
			throw new Error("Invalid WebP: truncated chunk");
		}

		const chunkEnd = payloadEnd + (chunkSize & 1);
		if (!["ICCP", "EXIF", "XMP "].includes(chunkType)) {
			const chunk = bytes.slice(offset, chunkEnd);
			if (chunkType === "VP8X") {
				if (chunkSize < 1) {
					throw new Error("Invalid WebP: VP8X chunk too small");
				}
				vp8xFlagsOffset =
					keptChunks.reduce((sum, item) => sum + item.length, 0) + 8;
			}
			keptChunks.push(chunk);
		}

		offset = chunkEnd;
	}

	const payloadSize = keptChunks.reduce(
		(sum, chunk) => sum + chunk.length,
		0,
	);
	const output = new Uint8Array(12 + payloadSize);

	output.set(bytes.slice(0, 4), 0); // RIFF
	writeUInt32LE(output, 4, payloadSize + 4);
	output.set(bytes.slice(8, 12), 8); // WEBP

	let outOffset = 12;
	for (const chunk of keptChunks) {
		output.set(chunk, outOffset);
		outOffset += chunk.length;
	}

	// If VP8X is present, clear metadata presence bits to match stripped chunks.
	if (vp8xFlagsOffset >= 0) {
		const METADATA_FLAG_MASK = 0x20 | 0x08 | 0x04; // ICCP | EXIF | XMP
		output[12 + vp8xFlagsOffset] &= ~METADATA_FLAG_MASK;
	}

	return output;
}

function toBytes(input: Uint8Array | ArrayBufferLike): Uint8Array {
	if (input instanceof Uint8Array) return input;
	return new Uint8Array(input);
}

function assertWebpHeader(bytes: Uint8Array): void {
	if (bytes.length < 12) {
		throw new Error("Invalid WebP: file too small");
	}

	if (readFourCC(bytes, 0) !== "RIFF" || readFourCC(bytes, 8) !== "WEBP") {
		throw new Error("Invalid WebP: missing RIFF/WEBP header");
	}
}

function readFourCC(bytes: Uint8Array, offset: number): string {
	return String.fromCharCode(
		bytes[offset],
		bytes[offset + 1],
		bytes[offset + 2],
		bytes[offset + 3],
	);
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
