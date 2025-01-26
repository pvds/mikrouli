import { cpus } from "node:os";
import { resolve } from "node:path";

// ##############################
// # Configuration
// # Only static values here
// ##############################

// Files
const PLACEHOLDERS_FILE = "placeholders.json";
const IMAGES_FILE = "images.json";

// Directories
const IMAGE_INPUT_DIR = "images";
const IMAGE_OUTPUT_DIR = "static/images";
const REPORTS_DIR = ".tmp/reports";
const BUILD_DIR_PRODUCTION = "build/production";
const BUILD_DIR_STAGING = "build/staging";
const JSON_OUTPUT_DIR = "src/data/generated";

// Image processing
export const IMAGE_FILENAME_TEMPLATE = "{base}-{size}.{ext}";
// biome-ignore format: better for readability
export const IMAGE_EXTENSIONS = [
	"avif", "dz", "fits", "gif", "heif", "input", "jpeg", "jpg", "jp2", "jxl",
	"magick", "openslide", "pdf", "png", "ppm", "raw", "svg", "tiff", "tif", "v", "webp",
];

// URL
export const URL_SUBFOLDER_STAGING = "/mikrouli";
export const URL_SUBFOLDER_PRODUCTION = "";
export const URL_ORIGIN_STAGING = "https://pvds.github.io";
export const URL_ORIGIN_PRODUCTION = "https://mikrouli.nl";

// Contentful
export const CONTENT_TYPES = [
	{ id: "navigation", query: "navigation" },
	{ id: "pages", query: "page" },
	{ id: "images", query: "image" },
	{ id: "settings", query: "settings" },
];

// Lighthouse
export const THRESHOLDS = {
	performance: 99,
	accessibility: 100,
	"best-practices": 100,
	seo: 100,
};

// Ports
export const PORT = 4173;
export const DEBUG_PORT = 9222;

// ##############################
// # Derived constants
// # Only dynamic values here
// ##############################

// Paths
const BASE_PATH = process.env.BASE_DIR || process.cwd();
export const PLACEHOLDERS_OUTPUT_PATH_RESOLVED = resolve(
	BASE_PATH,
	JSON_OUTPUT_DIR,
	PLACEHOLDERS_FILE,
);
export const IMAGES_JSON_OUTPUT_PATH_RESOLVED = resolve(BASE_PATH, JSON_OUTPUT_DIR, IMAGES_FILE);
export const IMAGE_INPUT_PATH_RESOLVED = resolve(BASE_PATH, IMAGE_INPUT_DIR);
export const IMAGE_OUTPUT_PATH_RESOLVED = resolve(BASE_PATH, IMAGE_OUTPUT_DIR);
export const REPORTS_PATH_RESOLVED = resolve(BASE_PATH, REPORTS_DIR);
export const BUILD_PATH_STAGING_RESOLVED = resolve(BASE_PATH, BUILD_DIR_PRODUCTION);
export const BUILD_PATH_PRODUCTION_RESOLVED = resolve(BASE_PATH, BUILD_DIR_STAGING);

// System
export const CPU_COUNT = Math.max(2, Math.floor(cpus().length / 2));

// Environment
export const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
export const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

// CLI args
const CLI_ARGS = process.argv.slice(2);
export const IS_CMS = CLI_ARGS.includes("--cms");
export const IS_LOCAL = CLI_ARGS.includes("--local");
export const IS_PROD = CLI_ARGS.includes("--prod");
export const IS_FORCE = CLI_ARGS.includes("--force");
export const IS_MINIMAL = CLI_ARGS.includes("--minimal");
export const IS_ALL = CLI_ARGS.includes("--all");
