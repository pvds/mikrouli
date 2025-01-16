/**
 * Transform the raw Contentful data into a structured shape
 * that matches our type definitions in contentful.d.ts.
 *
 * @return {import('$lib/types/contentful.d.js').ContentfulData}
 */
export function transformContentfulData(data = {}) {
	const allSectionsMap = {};

	// Extract raw arrays (or default to empty arrays)
	const pagesRaw = data.pages || [];
	const servicesRaw = data.services || [];
	const postsRaw = data.posts || [];
	const navigationRaw = data.navigation || [];

	// Collect sections from all content arrays using for...of
	for (const entries of [pagesRaw, servicesRaw, postsRaw, navigationRaw]) {
		collectSections(entries, allSectionsMap);
	}

	// Parse each content type
	const pages = pagesRaw.map((rawPage) => parseContentEntry(rawPage, allSectionsMap));
	const services = servicesRaw.map((rawService) => parseContentEntry(rawService, allSectionsMap));
	const posts = postsRaw.map((rawPost) => parseContentEntry(rawPost, allSectionsMap));
	const navigation = navigationRaw.map((rawNav) => parseNavigation(rawNav, pages));

	return { navigation, pages, services, posts };
}

/**
 * Collects any "section" entries (or references) from the given entries.
 *
 * @param {Array} entries Array of raw Contentful entries (pages, services, etc.)
 * @param {Object} allSectionsMap The map of all section entries by ID
 */
function collectSections(entries, allSectionsMap) {
	const addSection = (entry) => {
		if (entry?.sys?.contentType?.sys?.id === "section") {
			const parsed = parseSection(entry);
			allSectionsMap[parsed.meta.id] = parsed;
		}
	};

	for (const entry of entries) {
		addSection(entry);
		for (const secRef of entry.fields?.sections || []) {
			addSection(secRef);
		}
	}
}

/**
 * Generic parser for content entries (used for Pages, Services, and Posts)
 * that resolve their 'sections'.
 *
 * @param {Object} rawEntry The raw Contentful entry
 * @param {Object} allSections Map of all parsed sections
 * @return {import('$lib/types/contentful').PageEntry}
 */
function parseContentEntry(rawEntry = {}, allSections = {}) {
	const meta = parseMeta(rawEntry.sys);
	const { sections = [], ...restFields } = rawEntry.fields || {};
	return {
		meta,
		fields: {
			...restFields,
			sections: resolveSections(sections, allSections),
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

/**
 * Parse a Section entry.
 * If there are no fields, only the metadata is returned.
 *
 * @param {Object} rawSection The raw section entry
 * @return {import('$lib/types/contentful').SectionEntry}
 */
function parseSection(rawSection = {}) {
	const meta = parseMeta(rawSection.sys);
	return rawSection.fields ? { meta, fields: { ...rawSection.fields } } : { meta };
}

/**
 * Resolve an array of section references into their fields.
 * Omits any references that cannot be resolved.
 *
 * @param {Array} sectionRefs Array of section reference objects
 * @param {Object} allSections Map of all parsed sections
 * @return {Array<import('$lib/types/contentful').SectionFields>}
 */
function resolveSections(sectionRefs = [], allSections = {}) {
	const resolved = [];
	for (const ref of sectionRefs) {
		const { fields } = allSections[ref.sys?.id] || {};
		if (fields) resolved.push({ ...fields });
	}
	return resolved;
}
