/**
 * Transform the raw Contentful data into a structured shape
 * that matches our type definitions in contentful.d.ts.
 *
 * @return {import('$lib/types/contentful.d.js').ContentfulData}
 */
export function transformContentfulData(data = {}) {
	// Keeps all found sections keyed by ID
	const allSectionsMap = {};

	// 1) Collect all sections from the main content arrays
	collectSections(data.pages || [], allSectionsMap);
	collectSections(data.services || [], allSectionsMap);
	collectSections(data.posts || [], allSectionsMap);
	collectSections(data.navigation || [], allSectionsMap);

	// 2) Parse each content type
	const pages = (data.pages || []).map((rawPage) => parsePage(rawPage, allSectionsMap));
	const services = (data.services || []).map((rawService) =>
		parseService(rawService, allSectionsMap),
	);
	const posts = (data.posts || []).map((rawPost) => parsePost(rawPost, allSectionsMap));
	const navigation = (data.navigation || [])
		.map((rawNav) => parseNavigation(rawNav, pages))
		.filter((n) => n);

	return { navigation, pages, services, posts };
}

/**
 * Collects any "section" entries embedded or referenced inside the given entries array.
 * @param {Array} entries Array of raw Contentful entries (pages, services, etc.)
 * @param {Object} allSectionsMap The global map of all section entries by ID
 */
function collectSections(entries, allSectionsMap) {
	for (const entry of entries) {
		// If this entry itself is a 'section'
		if (entry.sys?.contentType?.sys?.id === "section") {
			const parsed = parseSection(entry);
			allSectionsMap[parsed.meta.id] = parsed;
		}
		// If it references an array of 'sections'
		if (Array.isArray(entry.fields?.sections)) {
			for (const secRef of entry.fields.sections) {
				if (secRef.sys?.contentType?.sys?.id === "section") {
					const nested = parseSection(secRef);
					allSectionsMap[nested.meta.id] = nested;
				}
			}
		}
	}
}

/**
 * Parse a Page entry, resolving 'sections'.
 * @return {import('$lib/types/contentful').PageEntry}
 */
function parsePage(rawPage = {}, allSections = {}) {
	const meta = parseMeta(rawPage.sys);
	// Destructure known reference fields and spread the rest.
	const { sections = [], ...restFields } = rawPage.fields || {};
	return {
		meta,
		fields: {
			...restFields,
			sections: resolveSections(sections, allSections),
		},
	};
}

/**
 * Parse a Service entry, resolving 'sections'.
 * @return {import('$lib/types/contentful').ServiceEntry}
 */
function parseService(rawService = {}, allSections = {}) {
	const meta = parseMeta(rawService.sys);
	const { sections = [], ...restFields } = rawService.fields || {};
	return {
		meta,
		fields: {
			...restFields,
			sections: resolveSections(sections, allSections),
		},
	};
}

/**
 * Parse a Post entry, resolving 'sections'.
 * @return {import('$lib/types/contentful').PostEntry}
 */
function parsePost(rawPost = {}, allSections = {}) {
	const meta = parseMeta(rawPost.sys);
	const { sections = [], ...restFields } = rawPost.fields || {};
	return {
		meta,
		fields: {
			...restFields,
			sections: resolveSections(sections, allSections),
		},
	};
}

/**
 * Parse Navigation, resolving pages
 * @return {import('$lib/types/contentful').NavigationEntry}
 */
function parseNavigation(rawNav = {}, pages = []) {
	const meta = parseMeta(rawNav.sys);
	const { items = [], ...restFields } = rawNav.fields || {};

	const parsedItems = items
		.map((pageRef) => {
			// Find the page by ID from the pages array
			const found = pages.find((p) => p.meta.id === pageRef.sys?.id);
			if (found) {
				const { title, header, slug } = found.fields;
				return { title, header, slug };
			}
			// Instead of a fallback object, we return null so we can filter these out.
			return null;
		})
		.filter((item) => item !== null);

	return {
		meta,
		fields: {
			...restFields,
			items: parsedItems,
		},
	};
}

/**
 * Convert Contentful sys object to a simpler 'meta' object.
 * @return {import('$lib/types/contentful').Metadata}
 */
function parseMeta(rawSys = {}) {
	const { id, type, createdAt, updatedAt, locale } = rawSys;
	return { id, type, createdAt, updatedAt, locale };
}

/**
 * Parse a Section entry if it has fields.
 * @return {import('$lib/types/contentful').SectionEntry}
 */
function parseSection(rawSection = {}) {
	const meta = parseMeta(rawSection.sys);
	if (!rawSection.fields) {
		return { meta };
	}

	const { ...restFields } = rawSection.fields;
	return { meta, fields: { ...restFields } };
}

/**
 * Turn an array of Section references into their resolved fields
 * @returns {Array<import('$lib/types/contentful').SectionEntry[]>}
 */
function resolveSections(sectionRefs = [], allSections = {}) {
	return sectionRefs
		.map((ref) => {
			const sectionEntry = allSections[ref.sys?.id];
			if (!sectionEntry?.fields) {
				return null;
			}
			return { ...sectionEntry.fields };
		})
		.filter((section) => section !== null);
}
