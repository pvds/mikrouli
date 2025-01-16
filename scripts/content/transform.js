/**
 * Transform the raw Contentful data into a more structured shape
 * that matches our type definitions in contentful.d.ts.
 *
 * @return {import('$lib/types/contentful.d.js').ContentfulData}
 */
export function transformContentfulData(data = {}) {
	// Keeps all found sections keyed by ID
	const allSectionsMap = {};

	/**
	 * Collects sections if the entry is or references a "section".
	 * @param {Array} entries
	 *   Array of raw Contentful entries (pages, services, etc.).
	 */
	function collectSections(entries = []) {
		for (const entry of entries) {
			// If this is itself a section
			if (entry.sys?.contentType?.sys?.id === "section") {
				const parsed = parseSection(entry);
				allSectionsMap[parsed.meta.id] = parsed;
			}
			// If it references sections
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

	// Collect sections from each content array
	collectSections(data.pages || []);
	collectSections(data.services || []);
	collectSections(data.posts || []);
	collectSections(data.navigation || []);

	// Parse Pages
	const pagesById = {};
	const pages = [];
	for (const rawPage of data.pages || []) {
		const parsed = parsePage(rawPage, allSectionsMap);
		pagesById[parsed.meta.id] = parsed;
		pages.push(parsed);
	}

	// Parse Services
	const servicesById = {};
	const services = [];
	for (const rawService of data.services || []) {
		const parsed = parseService(rawService, allSectionsMap);
		servicesById[parsed.meta.id] = parsed;
		services.push(parsed);
	}

	// Parse Posts
	const postsById = {};
	const posts = [];
	for (const rawPost of data.posts || []) {
		const parsed = parsePost(rawPost);
		postsById[parsed.meta.id] = parsed;
		posts.push(parsed);
	}

	// Parse Navigation, referencing pagesById
	const navigation = [];
	for (const nav of data.navigation || []) {
		navigation.push(parseNavigation(nav, pagesById));
	}

	// Return final structure (no top-level `sections` array)
	return { navigation, pages, services, posts };
}

/**
 * Parses a single Page entry, resolving its 'sections' references.
 * @return {import('$lib/types/contentful.d.js').PageEntry}
 */
function parsePage(rawPage = {}, allSections = {}) {
	const meta = parseMeta(rawPage.sys);
	const { title, header, slug, intro, sections = [] } = rawPage.fields || {};

	return {
		meta,
		fields: {
			title,
			header,
			slug,
			intro,
			sections: resolveSections(sections, allSections),
		},
	};
}

/**
 * Parses a single Service entry, resolving its 'sections' references.
 * @return {import('$lib/types/contentful.d.js').ServiceEntry}
 */
function parseService(rawService = {}, allSections = {}) {
	const meta = parseMeta(rawService.sys);
	const { title, header, slug, intro, sections = [] } = rawService.fields || {};

	return {
		meta,
		fields: {
			title,
			header,
			slug,
			intro,
			sections: resolveSections(sections, allSections),
		},
	};
}

/**
 * Parses a single Post entry.
 * @return {import('$lib/types/contentful.d.js').PostEntry}
 */
function parsePost(rawPost = {}) {
	const meta = parseMeta(rawPost.sys);
	const { title, header, slug, intro } = rawPost.fields || {};
	return { meta, fields: { title, header, slug, intro } };
}

/**
 * Parses a single Navigation entry, referencing known Pages by ID.
 * @return {import('$lib/types/contentful.d.js').NavigationEntry}
 */
function parseNavigation(rawNav = {}, pagesById = {}) {
	const meta = parseMeta(rawNav.sys);
	const { title, slug, items = [] } = rawNav.fields || {};

	const pages = items.map((pageRef) => {
		const pageEntry = pagesById[pageRef.sys?.id];
		return pageEntry ? pageEntry.fields : { title: "", slug: "", intro: "", sections: [] };
	});

	return { meta, fields: { title, slug, items: pages } };
}

/**
 * Simplifies the Contentful sys object but returns it as 'meta' data.
 * @return {import('$lib/types/contentful.d.js').Metadata} // If your type is still named Sys
 */
function parseMeta(rawSys = {}) {
	const { id, type, createdAt, updatedAt, locale } = rawSys;
	return { id, type, createdAt, updatedAt, locale };
}

/**
 * Parses a Section entry (or returns a minimal meta if fields missing).
 * @return {import('$lib/types/contentful.d.js').SectionEntry}
 */
function parseSection(rawSection = {}) {
	const meta = parseMeta(rawSection.sys);
	if (!rawSection.fields) return { meta };

	const { title, header, content } = rawSection.fields;
	return { meta, fields: { title, header, content } };
}

/**
 * Helper to turn an array of section references into resolved fields.
 * This reduces in-line nesting in parsePage/parseService.
 */
function resolveSections(sectionRefs = [], allSections = {}) {
	return sectionRefs.map((ref) => {
		const sectionEntry = allSections[ref.sys?.id];
		return !sectionEntry?.fields
			? { title: "", content: "" }
			: {
					title: sectionEntry.fields.title,
					header: sectionEntry.fields.header,
					content: sectionEntry.fields.content,
				};
	});
}
