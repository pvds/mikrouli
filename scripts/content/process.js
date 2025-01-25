/**
 * Transform the raw Contentful data into a structured shape
 * that matches our type definitions in contentful.d.ts.
 *
 * @return {import('$lib/types/contentful.d.js').ContentfulData}
 */
export function processContentfulData(data = {}) {
	// Extract raw arrays (or default to empty arrays)
	const pagesRaw = data.pages || [];
	const servicesRaw = data.services || [];
	const postsRaw = data.posts || [];
	const navigationRaw = data.navigation || [];

	// Parse each content type
	const pages = pagesRaw.map((rawPage) => parseContentEntry(rawPage));
	const services = servicesRaw.map((rawService) => parseContentEntry(rawService));
	const posts = postsRaw.map((rawPost) => parseContentEntry(rawPost));
	const navigation = navigationRaw.map((rawNav) => parseNavigation(rawNav, pages));
	const images = parseImages(data);

	return { navigation, pages, services, posts, images };
}

/**
 * Parse images from Contentful data.
 *
 * TODO: consider optimizing by using processed data instead of raw data.
 * @param data
 * @return {string[]}
 */
export const parseImages = (data) => {
	const urls = Object.values(data)
		// Flatten all collections (each collection is an array of items)
		.flat()
		// Extract each item's fields (using destructuring)
		.flatMap(({ fields }) => Object.values(fields))
		// Filter for image fields (which always have a nested fields property)
		// where file.contentType starts with "image/"
		.filter((field) => field.fields?.file?.contentType?.startsWith("image/"))
		// Map to the image URL from the unwrapped asset
		.map((image) => image.fields.file.url);

	// Remove duplicates by converting to a Set and back to an array.
	return [...new Set(urls)];
};

/**
 * Generic parser for content entries (used for Pages, Services, and Posts)
 * that resolve their 'sections'.
 *
 * @param {Object} rawEntry The raw Contentful entry
 * @param {boolean} isTopLevel
 * @return {import('$lib/types/contentful').BaseEntry}
 */
export function parseContentEntry(rawEntry = {}, isTopLevel = true) {
	const meta = isTopLevel && rawEntry.sys ? parseMeta(rawEntry.sys) : undefined;
	const {
		sections = [],
		/** @type {import('$lib/types/contentful').BaseFields} */ ...restFields
	} = rawEntry.fields || {};

	for (const key of Object.keys(restFields)) {
		// Process only objects that have a 'fields' property
		if (restFields[key] && typeof restFields[key] === "object" && "fields" in restFields[key]) {
			// Recursively parse nested content entry as non-top-level (no meta and no sections)
			restFields[key] = parseContentEntry(restFields[key], false).fields;
		}
	}

	// Only include meta and sections when at top-level
	// @ts-ignore - need to figure out how to type this properly without breaking typing in other places
	return isTopLevel
		? { meta, fields: { ...restFields, sections: [] } }
		: { fields: { ...restFields } };
}

/**
 * Parse Navigation, resolving page references.
 * Only includes the page's title, header, and slug.
 * If a referenced page can't be found, it is omitted.
 *
 * @param {Object} rawNav The raw navigation entry
 * @param {Array} pages Array of parsed Page entries
 * @return {import('$lib/types/contentful').NavigationEntry}
 */
function parseNavigation(rawNav = {}, pages = []) {
	const meta = parseMeta(rawNav.sys);
	const { items = [], ...restFields } = rawNav.fields || {};
	const parsedItems = [];

	for (const pageRef of items) {
		const found = pages.find((p) => p.meta.id === pageRef.sys?.id);
		if (!found) continue;
		const { title, header, slug } = found.fields;
		parsedItems.push({ title, header, slug });
	}

	return {
		meta,
		fields: { ...restFields, items: parsedItems },
	};
}

/**
 * Convert a raw sys object into a simpler 'meta' object.
 *
 * @param {Object} rawSys The raw sys object from Contentful
 * @return {import('$lib/types/contentful').Metadata}
 */
function parseMeta(rawSys = {}) {
	const { id, type, createdAt, updatedAt, locale } = rawSys;
	return { id, type, createdAt, updatedAt, locale };
}
