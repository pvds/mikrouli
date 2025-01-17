/**
 * Transform the raw Contentful data into a structured shape
 * that matches our type definitions in contentful.d.ts.
 *
 * @return {import('$lib/types/contentful.d.js').ContentfulData}
 */
export function transformContentfulData(data = {}) {
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

	return { navigation, pages, services, posts };
}

/**
 * Generic parser for content entries (used for Pages, Services, and Posts)
 * that resolve their 'sections'.
 *
 * @param {Object} rawEntry The raw Contentful entry
 * @return {import('$lib/types/contentful').PageEntry}
 */
function parseContentEntry(rawEntry = {}) {
	const meta = parseMeta(rawEntry.sys);
	const { sections = [], ...restFields } = rawEntry.fields || {};
	return {
		meta,
		fields: {
			...restFields,
			sections: [], // Placeholder for future content parsing (avoids type errors)
		},
	};
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
