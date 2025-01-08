/**
 * Transform the raw Contentful data into a more structured shape
 * that matches our type definitions in contentful.d.ts.
 *
 * Reads the raw data from content.json, resolves references, and returns:
 *
 * {
 *   navigation: NavigationEntry[],
 *   pages: PageEntry[],
 *   services: ServiceEntry[],
 *   posts: PostEntry[],
 * }
 */
export function transformContentfulData(data = {}) {
	// Keeps all found sections keyed by ID
	const allSectionsMap = {};

	// Collects sections if the entry is or references a "section"
	function collectSections(entries = []) {
		for (const entry of entries) {
			// If this is itself a section
			if (entry.sys?.contentType?.sys?.id === "section") {
				const parsed = parseSection(entry);
				allSectionsMap[parsed.sys.id] = parsed;
			}
			// If it references sections
			if (Array.isArray(entry.fields?.sections)) {
				for (const secRef of entry.fields.sections) {
					if (secRef.sys?.contentType?.sys?.id === "section") {
						const nested = parseSection(secRef);
						allSectionsMap[nested.sys.id] = nested;
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
		pagesById[parsed.sys.id] = parsed;
		pages.push(parsed);
	}

	// Parse Services
	const servicesById = {};
	const services = [];
	for (const rawService of data.services || []) {
		const parsed = parseService(rawService, allSectionsMap);
		servicesById[parsed.sys.id] = parsed;
		services.push(parsed);
	}

	// Parse Posts
	const postsById = {};
	const posts = [];
	for (const rawPost of data.posts || []) {
		const parsed = parsePost(rawPost);
		postsById[parsed.sys.id] = parsed;
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
 */
function parsePage(rawPage = {}, allSections = {}) {
	const sys = parseSys(rawPage.sys);
	const { title, header, slug, intro, sections = [] } = rawPage.fields || {};

	return {
		sys,
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
 */
function parseService(rawService = {}, allSections = {}) {
	const sys = parseSys(rawService.sys);
	const { title, header, slug, intro, sections = [] } = rawService.fields || {};

	return {
		sys,
		fields: {
			title,
			header,
			slug,
			intro,
			sections: resolveSections(sections, allSections),
		},
	};
}

/** Parses a single Post entry. */
function parsePost(rawPost = {}) {
	const sys = parseSys(rawPost.sys);
	const { title, header, slug, intro } = rawPost.fields || {};
	return { sys, fields: { title, header, slug, intro } };
}

/**
 * Parses a single Navigation entry, referencing known Pages by ID.
 */
function parseNavigation(rawNav = {}, pagesById = {}) {
	const sys = parseSys(rawNav.sys);
	const { title, items = [] } = rawNav.fields || {};

	const resolvedItems = items.map((pageRef) => {
		const pageEntry = pagesById[pageRef.sys?.id];
		return pageEntry ? pageEntry.fields : { title: "", slug: "", intro: "", sections: [] };
	});

	return { sys, fields: { title, items: resolvedItems } };
}

/** Simplifies the Contentful sys object. */
function parseSys(rawSys = {}) {
	const { id, type, createdAt, updatedAt, locale } = rawSys;
	return { id, type, createdAt, updatedAt, locale };
}

/** Parses a Section entry (or returns a minimal sys if fields missing). */
function parseSection(rawSection = {}) {
	const sys = parseSys(rawSection.sys);
	if (!rawSection.fields) return { sys };

	const { title, header, content } = rawSection.fields;
	return { sys, fields: { title, header, content } };
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
