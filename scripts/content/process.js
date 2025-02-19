/**
 * @typedef {import('$lib/types/contentful').ContentfulData} ContentfulData
 * @typedef {import('$lib/types/contentful').BaseFields} BaseFields
 * @typedef {import('$lib/types/contentful').BaseFieldsMinimal} BaseFieldsMinimal
 * @typedef {import('$lib/types/contentful').SectionEntry} SectionEntry
 * @typedef {import('$lib/types/contentful').PageEntry} PageEntry
 * @typedef {import('$lib/types/contentful').PageFields} PageFields
 * @typedef {import('$lib/types/contentful').ServiceEntry} ServiceEntry
 * @typedef {import('$lib/types/contentful').PostEntry} PostEntry
 * @typedef {import('$lib/types/contentful').LinkEntry} LinkEntry
 * @typedef {import('$lib/types/contentful').NavigationEntry} NavigationEntry
 * @typedef {import('$lib/types/contentful').NavigationFields} NavigationFields
 * @typedef {import('$lib/types/contentful').NavigationFieldItems} NavigationFieldItems
 * @typedef {import('$lib/types/contentful').NavigationFieldEntries} NavigationFieldEntries
 * @typedef {import('$lib/types/contentful').ReviewEntry} ReviewEntry
 * @typedef {import('$lib/types/contentful').ReviewFields} ReviewFields
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
	const reviewsRaw = data.reviews || emptyEntries;
	const navigationRaw = data.navigation || emptyEntries;
	const sectionsRaw = data.sections || emptyEntries;

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
	const sections = /** @type {SectionEntry[]} */ (
		sectionsRaw.map((rawSection) => parseContentEntry(rawSection))
	);
	const reviews = /** @type {ReviewEntry[]} */ (
		reviewsRaw.map((rawReview) => parseReviewEntry(rawReview))
	);
	const navigation = navigationRaw.map((rawNav) => parseNavigation(rawNav, pages));
	const images = parseImageUrls(data);

	return { navigation, pages, services, posts, reviews, sections, images };
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
 * that also parses any nested section entries.
 *
 * @param {ContentfulEntry} rawEntry The raw Contentful entry.
 * @returns {PostEntry | PageEntry | ServiceEntry | SectionEntry} The processed entry.
 */
export function parseContentEntry(rawEntry) {
	const meta = parseMeta(rawEntry.sys);
	/** @type {Record<string, unknown>} */
	const restFields = { ...rawEntry.fields };

	for (const key of Object.keys(restFields)) {
		const value = restFields[key];
		if ((key === "sections" || key === "children") && Array.isArray(value)) {
			restFields[key] = value
				.filter(isContentfulEntry)
				.map((entry) => parseContentEntry(entry).fields);
		} else if (isContentfulEntry(value)) {
			restFields[key] = value.fields;
		}
	}

	const fields = /** @type {BaseFields} */ (restFields);
	return { meta, fields };
}

/**
 * Parse a review entry.
 * Only includes names of non-anonymous reviewers.
 * @param {ContentfulEntry} rawReview The raw review entry
 * @return ReviewEntry
 */
function parseReviewEntry(rawReview) {
	const meta = parseMeta(rawReview.sys);
	const { reviewer, ...fields } = /** @type {ReviewFields} */ rawReview.fields;

	// Exclude reviewer field if anonymous
	if (!fields.anonymous) {
		fields.reviewer = reviewer;
	}

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
	const { /** @type {NavigationFieldEntries[]} */ items = [], ...restFields } = rawNav.fields;
	/** @type {Partial<NavigationFieldItems>[]} */
	const parsedItems = [];

	for (const item of items) {
		const page = pages.find((p) => p?.meta?.id === item?.sys?.id);

		if (page) {
			// Page fields
			const { title, header, slug, hidden } = page.fields;

			const items = page.fields.children?.map((child) => {
				console.error(child);
				return {
					title: child.title,
					longTitle: child.header,
					url: `${slug}/${child.slug}`,
					hidden: child.hidden,
					isExternal: false,
				};
			});
			parsedItems.push({
				title,
				longTitle: header,
				url: slug,
				hidden,
				isExternal: false,
				items,
			});
		} else {
			// Link fields
			const { title, url } = item.fields;
			parsedItems.push({ title, longTitle: title, url, hidden: false, isExternal: true });
		}
	}

	const fields = /** @type {NavigationFields} */ { ...restFields, items: parsedItems };
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

/**
 * Checks if a value is a Contentful entry.
 * @param {unknown} obj
 * @returns {obj is ContentfulEntry}
 */
function isContentfulEntry(obj) {
	return obj !== null && typeof obj === "object" && "fields" in obj && "sys" in obj;
}
