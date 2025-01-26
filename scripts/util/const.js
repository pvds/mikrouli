// ##############################
// # Configuration
// # Only static values here
// ##############################

// Files
export const PLACEHOLDERS_FILE = "placeholders.json";
export const IMAGES_FILE = "images.json";

// Directories
export const IMAGE_INPUT_DIR = "images";
export const IMAGE_OUTPUT_DIR = "static/images";
export const REPORTS_DIR = ".tmp/reports";
export const BUILD_DIR_PRODUCTION = "build/production";
export const BUILD_DIR_STAGING = "build/staging";
export const JSON_OUTPUT_DIR = "src/data/generated";

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
