import { cpus } from "node:os";
import { resolve } from "node:path";

// ========================================
// Static Constants
//
// Use for values that remain unchanged throughout the runtime.
// When: If the value is universal and consistent across environments.
// ========================================

export const IMAGE_FILENAME_TEMPLATE = "{base}-{size}.{ext}";
// biome-ignore format: better for readability
export const IMAGE_EXTENSIONS = [
	"avif", "dz", "fits", "gif", "heif", "input", "jpeg", "jpg", "jp2", "jxl",
	"magick", "openslide", "pdf", "png", "ppm", "raw", "svg", "tiff", "tif", "v", "webp",
];

// ========================================
// Configuration & Paths
//
// Use for paths that depend on environment variables or project structure.
// When: If paths need to adapt based on different environments.
// ========================================

const BASE_PATH = process.env.BASE_DIR || process.cwd();
export const PLACEHOLDERS_OUTPUT_PATH = resolve(BASE_PATH, "src/data/generated/placeholders.json");
export const IMAGE_INPUT_PATH = resolve(BASE_PATH, "images");
export const IMAGE_OUTPUT_PATH = resolve(BASE_PATH, "static/images");

// ========================================
// Runtime-Dependent Constants
//
// Use for values that depend on system resources or runtime state.
// When: If the value should reflect the environment at runtime.
// ========================================

export const CPU_COUNT = Math.max(2, Math.floor(cpus().length / 2));

// ========================================
// Conditional Runtime Values
//
// Use functions for values that should be evaluated each time they're accessed.
// When: If the value depends on dynamic runtime input (e.g., CLI arguments).
// ========================================

export const IS_CMS = () => process.argv.slice(2).includes("--cms");
export const IS_LOCAL = () => process.argv.slice(2).includes("--local");
