/**
 * @typedef {import('$lib/types/contentful').ContentfulData} ContentfulData
 * @typedef {import('$lib/types/contentful').BaseEntry} BaseEntry
 * @typedef {import('$lib/types/contentful').BaseFields} BaseFields
 * @typedef {import('$lib/types/contentful').BaseFieldsMinimal} BaseFieldsMinimal
 * @typedef {import('$lib/types/contentful').PageEntry} PageEntry
 * @typedef {import('$lib/types/contentful').PageFields} PageFields
 * @typedef {import('$lib/types/contentful').ServiceEntry} ServiceEntry
 * @typedef {import('$lib/types/contentful').PostEntry} PostEntry
 * @typedef {import('$lib/types/contentful').NavigationEntry} NavigationEntry
 * @typedef {import('$lib/types/contentful').NavigationFields} NavigationFields
 * @typedef {import('$lib/types/contentful').Metadata} Metadata
 * @typedef {import('contentful').Entry} ContentfulEntry
 * @typedef {import('contentful').EntrySys} EntrySys
 * @typedef {import('contentful').EntrySkeletonType} EntrySkeletonType
 */

/**
 * Transform the raw Contentful data into a structured shape
 * that matches our type definitions.
 *
 * @param {Record<string, ContentfulEntry[]>} data The raw Contentful data
 * @return ContentfulData
 */
export function processContentfulData(data = {}) {
	/** @type {ContentfulEntry[]} */
	const emptyEntries = [];
	const pagesRaw = data.pages || emptyEntries;
	const servicesRaw = data.services || emptyEntries;
	const postsRaw = data.posts || emptyEntries;
	const navigationRaw = data.navigation || emptyEntries;

	// Parse each content type
	const pages = /** @type {PageEntry[]} */ (
		pagesRaw.map((rawPage) => parseContentEntry(rawPage))
	);
	const services = /** @type {ServiceEntry[]} */ (
		servicesRaw.map((rawService) => parseContentEntry(rawService))
	);
	const posts = /** @type {PostEntry[]} */ (
		postsRaw.map((rawPost) => parseContentEntry(rawPost))
	);
	const navigation = navigationRaw.map((rawNav) => parseNavigation(rawNav, pages));
	const images = parseImageUrls(data);

	return { navigation, pages, services, posts, images };
}

/**
 * Parse images from Contentful data.
 *
 * @param {Record<string, ContentfulEntry[]>} data The raw Contentful data
 * @return {string[]}
 */
export const parseImageUrls = (data) => {
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
 * that also resolves any nested section entries.
 *
 * @param {ContentfulEntry} rawEntry The raw Contentful entry
 * @return {PostEntry | PageEntry | ServiceEntry}
 */
export function parseContentEntry(rawEntry) {
	const meta = parseMeta(rawEntry.sys);
	const restFields = { ...rawEntry.fields };

	// Process each field in the entry.
	for (const key of Object.keys(restFields)) {
		// If this is the new nested sections field, process each nested entry recursively.
		if (key === "sections" && Array.isArray(restFields[key])) {
			const rawSections = restFields[key];
			const processedSections = [];
			for (const sectionEntry of rawSections) {
				if (sectionEntry && typeof sectionEntry === "object" && "fields" in sectionEntry) {
					processedSections.push(sectionEntry.fields);
				}
			}
			restFields[key] = processedSections;
		} else if (
			restFields[key] &&
			typeof restFields[key] === "object" &&
			"fields" in restFields[key]
		) {
			// Unwrap any nested single content entry.
			restFields[key] = restFields[key].fields;
		}
	}

	const fields = /** @type {BaseFields} */ ({ ...restFields });
	return { meta, fields };
}

/**
 * Parse Navigation, resolving page references.
 * Only includes the page's title, header, and slug.
 * If a referenced page can't be found, it is omitted.
 *
 * @param {ContentfulEntry} rawNav The raw navigation entry
 * @param {PageEntry[]} pages Array of parsed Page entries
 * @return NavigationEntry
 */
function parseNavigation(rawNav, pages) {
	const meta = parseMeta(rawNav?.sys || {});
	/** @type {EntrySkeletonType['fields']} */
	const { items = [], ...restFields } = rawNav.fields;
	/** @type {Partial<BaseFieldsMinimal>[]} */
	const parsedItems = [];

	for (const pageRef of items) {
		const found = pages.find((p) => p?.meta?.id === pageRef?.sys?.id);
		if (!found) continue;
		const { title, header, slug } = found.fields;
		parsedItems.push({ title, header, slug });
	}

	const fields = { ...restFields, items: parsedItems };
	return { meta, fields };
}

/**
 * Convert a raw sys object into a simpler 'meta' object.
 *
 * @param {EntrySys} rawSys The raw sys object from Contentful
 * @return Metadata
 */
function parseMeta({ id, type, createdAt, updatedAt, locale }) {
	return {
		id,
		type,
		createdAt,
		updatedAt,
		locale: locale || "en-US",
	};
}
