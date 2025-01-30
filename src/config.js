// ##################################################
// Configuration
// - only static values here
// - for dynamic values use `dyn.js`
// ##################################################

// Files
export const METADATA_FILE = "metadata.json";
export const IMAGES_FILE = "images.json";

// Directories
export const IMAGE_INPUT_DIR = "images";
export const IMAGE_OUTPUT_DIR = "static/images";
export const REPORTS_DIR = ".tmp/reports";
export const BUILD_DIR_PRODUCTION = "build/production";
export const BUILD_DIR_STAGING = "build/staging";
export const JSON_OUTPUT_DIR = "src/data/generated";

// Image processing
export const IMAGE_SIZES = [320, 640, 1280, 1920];
export const IMAGE_FILENAME_TEMPLATE = "{base}-{size}.{ext}";
// biome-ignore format: better for readability
export const IMAGE_EXTENSIONS = [
	"avif", "dz", "fits", "gif", "heif", "input", "jpeg", "jpg", "jp2", "jxl",
	"magick", "openslide", "pdf", "png", "ppm", "raw", "svg", "tiff", "tif", "v", "webp",
];

// URL
export const URL_SUBFOLDER_STAGING = "/mikrouli";
export const URL_SUBFOLDER_PRODUCTION = "";
export const URL_BASE_STAGING = "https://pvdv.github.io/mikrouli";
export const URL_BASE_PRODUCTION = "https://mikrouli.com";

// Contentful
/** @type {{id: string, content_type: string, order: any}[]} */
export const CONTENT_TYPES = [
	{ id: "navigation", content_type: "navigation", order: "fields.title" },
	{ id: "pages", content_type: "page", order: "fields.title" },
	{ id: "services", content_type: "service", order: "fields.order" },
	{ id: "posts", content_type: "post", order: "-sys.createdAt" },
];

// Lighthouse
export const THRESHOLDS = {
	performance: 99,
	accessibility: 100,
	"best-practices": 100,
	seo: 100,
};

// Booking
export const BOOKING_URL = "https://mikrouli.setmore.com";
const BOOKING_PATH = "/book";
const BOOKING_INTAKE_PATH =
	"/book?step=time-slot&products=6e0f678a-c1ef-49ae-bc6e-0087886e4e22&type=service&staff=cbd74a17-ccea-4b29-98a7-b7f90abc10e2&staffSelected=true";
const BOOKING_SESSION_PATH =
	"/book?step=time-slot&products=09def0c7-8a39-48de-8167-5d6bff597020&type=service&staff=cbd74a17-ccea-4b29-98a7-b7f90abc10e2&staffSelected=true";
const BOOKING_PAGE_CTA = "View Booking page";
const BOOKING_BOOK_CTA = "Schedule a Session";
const BOOKING_INTAKE_CTA = "Schedule an Intake";
const BOOKING_SESSION_CTA = "Schedule a Therapy Session";

/**
 * @typedef {{cta: string, url: string}} BookingOption
 * @return {{
 * page: BookingOption,
 * book: BookingOption,
 * intake: BookingOption,
 * session: BookingOption}}}
 **/
export const BOOKING_OPTIONS = {
	page: {
		cta: BOOKING_PAGE_CTA,
		url: BOOKING_URL,
	},
	book: {
		cta: BOOKING_BOOK_CTA,
		url: BOOKING_URL + BOOKING_PATH,
	},
	intake: {
		cta: BOOKING_INTAKE_CTA,
		url: BOOKING_URL + BOOKING_INTAKE_PATH,
	},
	session: {
		cta: BOOKING_SESSION_CTA,
		url: BOOKING_URL + BOOKING_SESSION_PATH,
	},
};

// Ports
export const PORT = 4173;
export const DEBUG_PORT = 9222;
