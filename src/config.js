// ##################################################
// Configuration
// - only static values here
// - for dynamic values use `dyn.js`
// ##################################################

// URL
export const URL_SUBFOLDER_STAGING = "/mikrouli";
export const URL_SUBFOLDER_PRODUCTION = "";
export const URL_BASE_STAGING = "https://pvdv.github.io/mikrouli";
export const URL_BASE_PRODUCTION = "https://mikrouli.nl";

// Site
export const SITE_PREVIEW_URL = "images/preview.webp";

// Organization
export const ORG_NAME = "Mikrouli";
export const ORG_SLOGAN = "Systemic Therapy for Individuals, Families, and Organizations";
export const ORG_LOGO_URL = "images/logo.svg";
export const ORG_VAT_ID = "FR12345678901";
export const ORG_TWITTER = "https://twitter.com/mikrouli";
export const ORG_LINKEDIN = "https://linkedin.com/company/mikrouli";

// Owner
export const OWNER_NAME = "Eleni Papamikrouli";
export const OWNER_JOB_TITLE = "Systemic Therapist";
export const OWNER_IMAGE = "images/eleni-papamikrouli.jpg";
export const OWNER_LINKEDIN = "https://www.linkedin.com/in/eleni-papamikrouli";
export const OWNER_TWITTER = "https://twitter.com/yourprofile";

// Contact
export const CONTACT_PHONE = "+31 6 1944 6263";
export const CONTACT_EMAIL = "contact@mikrouli.nl";
export const CONTACT_STREET = "Virulypad 61";
export const CONTACT_CITY = "Leiden";
export const CONTACT_POSTAL = "2316 ZT";
export const CONTACT_COUNTRY = "NL";

// SEO
/** @type {import('$global/seo/Seo.svelte.types').SEOProps} */
export const SEO_DEFAULT = {
	titleSlogan: ORG_SLOGAN,
	siteName: ORG_NAME,
	imageURL: "images/preview.webp",
	logo: ORG_LOGO_URL,
	author: OWNER_NAME,
	type: "website",
	index: false,
	twitter: true,
	openGraph: true,
};
export const SEO_USE_AGGREGATE_RATING = false;

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
export const IMAGE_EXT = "webp";
export const IMAGE_SIZES = [320, 480, 640, 720, 960, 1280, 1920];
export const IMAGE_THUMBNAIL_SIZE = IMAGE_SIZES[0];
export const IMAGE_FILENAME_TEMPLATE = "{base}-{size}.{ext}";
// biome-ignore format: better for readability
export const IMAGE_EXTENSIONS = [
	"avif", "dz", "fits", "gif", "heif", "input", "jpeg", "jpg", "jp2", "jxl",
	"magick", "openslide", "pdf", "png", "ppm", "raw", "svg", "tiff", "tif", "v", "webp",
];

// Ports
export const PORT = 4173;
export const DEBUG_PORT = 9222;

// Contentful
/** @type {{id: string, content_type: string, order: any}[]} */
export const CONTENT_TYPES = [
	{ id: "navigation", content_type: "navigation", order: "fields.title" },
	{ id: "pages", content_type: "page", order: "fields.title" },
	{ id: "services", content_type: "service", order: "fields.order" },
	{ id: "posts", content_type: "post", order: "-sys.createdAt" },
	{ id: "reviews", content_type: "review", order: "-sys.createdAt" },
];

// Spacing
export const SPACING_X_CLASSES = "px-4 sm:px-6 md:px-8";

// Prose
export const PROSE_CLASSES_SM =
	"prose-sm prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-base";
export const PROSE_CLASSES_MD = "prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg";
export const PROSE_CLASSES_LG =
	"prose-lg prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg";

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
