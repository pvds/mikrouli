/**
 * Transform the raw Contentful data into a more structured shape
 * that matches your updated type definitions:
 *
 * export type ContentfulData = {
 *   navigation: NavigationEntry[];
 *   pages: PageEntry[];
 *   services: ServiceEntry[];
 *   posts: PostEntry[];
 * };
 *
 * Where each of those four arrays contains entries (with `sys` + `fields`),
 * and the `fields` for pages/services have `sections` arrays that hold
 * section fields (not separate top-level section entries).
 */

/**
 * @param {Object} rawSys - The sys object from Contentful
 * @returns {Object} A simplified sys object
 */
function parseSys(rawSys) {
	return {
		id: rawSys.id,
		type: rawSys.type,
		createdAt: rawSys.createdAt,
		updatedAt: rawSys.updatedAt,
		locale: rawSys.locale,
	};
}

/**
 * @param {Object} rawSection - A raw entry that may represent a section
 * @returns {Object} A parsed section entry (with sys and possibly fields)
 */
function parseSection(rawSection) {
	const sys = parseSys(rawSection.sys);

	if (!rawSection.fields) {
		return { sys };
	}

	return {
		sys,
		fields: {
			title: rawSection.fields.title,
			header: rawSection.fields.header,
			content: rawSection.fields.content,
		},
	};
}

/**
 * @param {Object} rawPage - A raw page entry
 * @param {Object} allSections - A dictionary of parsed sections keyed by sys.id
 * @returns {Object} A parsed page entry with `sys` and `fields`
 */
function parsePage(rawPage, allSections) {
	const sys = parseSys(rawPage.sys);
	const fields = {
		title: rawPage.fields.title,
		header: rawPage.fields.header, // optional
		slug: rawPage.fields.slug,
		intro: rawPage.fields.intro,
		sections: [],
	};

	if (Array.isArray(rawPage.fields.sections)) {
		fields.sections = rawPage.fields.sections.map((secRef) => {
			const sectionEntry = allSections[secRef.sys?.id];
			if (!sectionEntry || !sectionEntry.fields) {
				// Provide a fallback if the section is missing or incomplete
				return { title: "", content: "" };
			}
			return {
				title: sectionEntry.fields.title,
				header: sectionEntry.fields.header, // optional
				content: sectionEntry.fields.content,
			};
		});
	}

	return { sys, fields };
}

/**
 * @param {Object} rawService - A raw service entry
 * @param {Object} allSections - A dictionary of parsed sections keyed by sys.id
 * @returns {Object} A parsed service entry with `sys` and `fields`
 */
function parseService(rawService, allSections) {
	const sys = parseSys(rawService.sys);
	const fields = {
		title: rawService.fields.title,
		header: rawService.fields.header, // optional
		slug: rawService.fields.slug,
		intro: rawService.fields.intro,
		sections: [],
	};

	if (Array.isArray(rawService.fields.sections)) {
		fields.sections = rawService.fields.sections.map((secRef) => {
			const sectionEntry = allSections[secRef.sys?.id];
			if (!sectionEntry || !sectionEntry.fields) {
				return { title: "", content: "" };
			}
			return {
				title: sectionEntry.fields.title,
				header: sectionEntry.fields.header,
				content: sectionEntry.fields.content,
			};
		});
	}

	return { sys, fields };
}

/**
 * @param {Object} rawPost - A raw post entry
 * @returns {Object} A parsed post entry with `sys` and `fields`
 */
function parsePost(rawPost) {
	const sys = parseSys(rawPost.sys);
	const fields = {
		title: rawPost.fields.title,
		header: rawPost.fields.header, // optional
		slug: rawPost.fields.slug,
		intro: rawPost.fields.intro,
	};
	return { sys, fields };
}

/**
 * @param {Object} rawNav - A raw navigation entry
 * @param {Object} pagesById - A dictionary of page entries keyed by sys.id
 * @returns {Object} A parsed navigation entry with `sys` and `fields`
 */
function parseNavigation(rawNav, pagesById) {
	const sys = parseSys(rawNav.sys);
	const fields = {
		title: rawNav.fields.title,
		items: [],
	};

	if (Array.isArray(rawNav.fields.items)) {
		fields.items = rawNav.fields.items.map((pageRef) => {
			const pageEntry = pagesById[pageRef.sys?.id];
			if (!pageEntry) {
				// Return a fallback if the reference is broken
				return { title: "", slug: "", intro: "", sections: [] };
			}
			return pageEntry.fields;
		});
	}

	return { sys, fields };
}

/**
 * Main transform function: reads the raw data object containing:
 *   { navigation, pages, services, posts }
 * resolves section references, and returns the final structured data:
 *
 * {
 *   navigation: NavigationEntry[],
 *   pages: PageEntry[],
 *   services: ServiceEntry[],
 *   posts: PostEntry[],
 * }
 *
 * No separate `sections` array is returned; section content is merged
 * into the `sections` field of pages/services as SectionFields[].
 *
 * @param {Object} data - The raw data from content.json
 * @returns {Object} The final ContentfulData structure (navigation, pages, services, posts)
 */
export function transformContentfulData(data) {
	// A map for all section entries found anywhere, keyed by ID
	const allSectionsMap = {};

	/**
	 * @param {Array} entries - An array of raw Contentful entries
	 * Collect sections if they exist or are referenced.
	 */
	function collectSections(entries) {
		if (!Array.isArray(entries)) return;

		for (const entry of entries) {
			// If this is itself a section
			if (entry.sys?.contentType?.sys?.id === "section") {
				const parsedSec = parseSection(entry);
				allSectionsMap[parsedSec.sys.id] = parsedSec;
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

	collectSections(data.pages);
	collectSections(data.services);
	collectSections(data.posts);
	collectSections(data.navigation);

	// Parse pages
	const pagesById = {};
	const pages = (data.pages || []).map((p) => {
		const parsed = parsePage(p, allSectionsMap);
		pagesById[parsed.sys.id] = parsed;
		return parsed;
	});

	// Parse services
	const servicesById = {};
	const services = (data.services || []).map((s) => {
		const parsed = parseService(s, allSectionsMap);
		servicesById[parsed.sys.id] = parsed;
		return parsed;
	});

	// Parse posts
	const postsById = {};
	const posts = (data.posts || []).map((p) => {
		const parsed = parsePost(p);
		postsById[parsed.sys.id] = parsed;
		return parsed;
	});

	// Parse navigation (uses pagesById to look up page fields)
	const navigation = (data.navigation || []).map((nav) => parseNavigation(nav, pagesById));

	// Return only the final structure (no top-level `sections` array)
	return {
		navigation,
		pages,
		services,
		posts,
	};
}
