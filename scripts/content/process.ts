import type { EntrySys } from "contentful";
import type {
	BaseFields,
	ContentfulData,
	Metadata,
	NavigationFieldItems,
	NavigationFields,
	PageEntry,
	PostEntry,
	ReviewEntry,
	ReviewFields,
	SectionEntry,
	SectionFields,
	ServiceEntry,
} from "$lib/types/contentful";
import type {
	ContentfulAssetData,
	ContentfulEntryData,
	ContentfulFileData,
} from "$types/contentful-runtime";

interface ParsedEntry {
	meta: Metadata;
	fields: BaseFields;
}

interface ParsedReviewEntry {
	meta: Metadata;
	fields: ReviewFields;
}

interface ParsedNavEntry {
	meta: Metadata;
	fields: NavigationFields;
}

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
	typeof value === "object" && value !== null;

const toEntry = (value: unknown): ContentfulEntryData =>
	isRecord(value) ? (value as ContentfulEntryData) : {};

const toFields = (value: unknown): UnknownRecord => {
	const entry = toEntry(value);
	return isRecord(entry.fields) ? entry.fields : {};
};

const toFile = (value: unknown): ContentfulFileData | undefined => {
	if (!isRecord(value) || !("fields" in value)) return undefined;
	const asset = value as ContentfulAssetData;
	return asset.fields?.file;
};

export function processContentfulData(
	data: Record<string, unknown[]> = {},
): ContentfulData {
	const emptyEntries: unknown[] = [];
	const pagesRaw = (data.pages as unknown[] | undefined) || emptyEntries;
	const servicesRaw =
		(data.services as unknown[] | undefined) || emptyEntries;
	const postsRaw = (data.posts as unknown[] | undefined) || emptyEntries;
	const reviewsRaw = (data.reviews as unknown[] | undefined) || emptyEntries;
	const navigationRaw =
		(data.navigation as unknown[] | undefined) || emptyEntries;
	const sectionsRaw =
		(data.sections as unknown[] | undefined) || emptyEntries;

	const pages = pagesRaw.map((rawPage) =>
		parseContentEntry(rawPage),
	) as PageEntry[];
	const services = servicesRaw.map((rawService) =>
		parseContentEntry(rawService),
	) as ServiceEntry[];
	const posts = postsRaw.map((rawPost) =>
		parseContentEntry(rawPost),
	) as PostEntry[];
	const sections = sectionsRaw.map((rawSection) =>
		parseSectionEntry(rawSection),
	);
	const reviews = reviewsRaw.map((rawReview) =>
		parseReviewEntry(rawReview),
	) as ReviewEntry[];
	const navigation = navigationRaw.map((rawNav) =>
		parseNavigation(rawNav, pages),
	);
	const images = parseImageUrls(data);

	return { navigation, pages, services, posts, reviews, sections, images };
}

export const parseImageUrls = (data: Record<string, unknown[]>): string[] => {
	const urls = Object.values(data)
		.flat()
		.flatMap((item: unknown) => Object.values(toFields(item)))
		.filter((field: unknown) =>
			toFile(field)?.contentType?.startsWith("image/"),
		)
		.map((image: unknown) => toFile(image)?.url)
		.filter((url): url is string => typeof url === "string");

	return [...new Set(urls)];
};

export function parseContentEntry(rawEntry: unknown): ParsedEntry {
	const entry = toEntry(rawEntry);
	const meta = parseMeta((entry.sys as EntrySys) || {});
	const restFields: UnknownRecord = { ...toFields(rawEntry) };

	for (const key of Object.keys(restFields)) {
		const value = restFields[key];
		if (
			(key === "sections" || key === "children") &&
			Array.isArray(value)
		) {
			restFields[key] = value
				.filter(isContentfulEntry)
				.map((nestedEntry: unknown) => {
					const parsed = parseContentEntry(nestedEntry);
					return {
						id: parsed.meta.id,
						...parsed.fields,
					};
				});
		} else if (isContentfulEntry(value)) {
			restFields[key] = toFields(value);
		}
	}

	const fields = restFields as BaseFields;
	return { meta, fields };
}

function parseReviewEntry(rawReview: unknown): ParsedReviewEntry {
	const entry = toEntry(rawReview);
	const meta = parseMeta((entry.sys as EntrySys) || {});
	const { reviewer, ...fields } = toFields(entry) as ReviewFields & {
		reviewer?: string;
	};

	const result: ReviewFields & { reviewer?: string } = fields;
	if (!fields.anonymous) {
		result.reviewer = reviewer;
	}

	return { meta, fields: result as ReviewFields };
}

function parseSectionEntry(rawSection: unknown): SectionEntry {
	const parsedSection = parseContentEntry(rawSection);
	const fields = parsedSection.fields as Record<string, unknown>;

	return {
		meta: parsedSection.meta,
		fields: {
			id: String(fields.id || ""),
			title: String(fields.title || ""),
			header:
				typeof fields.header === "string" ? fields.header : undefined,
			content: String(fields.content || ""),
			image: fields.image as SectionFields["image"],
		},
	};
}

function parseNavigation(rawNav: unknown, pages: PageEntry[]): ParsedNavEntry {
	const nav = toEntry(rawNav);
	const meta = parseMeta((nav?.sys as EntrySys) || {});
	const { items = [], ...restFields } = toFields(nav);

	const parsedItems: Partial<NavigationFieldItems>[] = [];

	if (Array.isArray(items)) {
		for (const item of items) {
			const itemEntry = toEntry(item);
			const page = pages.find(
				(p) =>
					p?.meta?.id ===
					(itemEntry.sys as UnknownRecord | undefined)?.id,
			);

			if (page) {
				const { title, menuTitle, header, slug, hidden } = page.fields;
				const children = page.fields.children as
					| Array<{
							title: string;
							header?: string;
							slug: string;
							hidden?: boolean;
					  }>
					| undefined;

				const childItems = children?.map((child) => ({
					title: child.title,
					longTitle: child.header,
					url: `${slug}/${child.slug}`,
					hidden: child.hidden,
					isExternal: false,
				}));

				parsedItems.push({
					title,
					menuTitle,
					longTitle: header,
					url: slug,
					hidden,
					isExternal: false,
					items: childItems,
				});
			} else {
				const linkFields = toFields(itemEntry);
				parsedItems.push({
					title: linkFields.title as string,
					longTitle: linkFields.title as string,
					url: linkFields.url as string,
					hidden: false,
					isExternal: true,
				});
			}
		}
	}

	const fields: NavigationFields = {
		...(restFields as NavigationFields),
		items: parsedItems as NavigationFieldItems[],
	};
	return { meta, fields };
}

interface ParsedMeta {
	id: string;
	type: string;
	createdAt: string;
	updatedAt: string;
	locale: string;
}

function parseMeta(rawSys: Partial<EntrySys>): ParsedMeta {
	return {
		id: rawSys.id || "",
		type: rawSys.type || "",
		createdAt: rawSys.createdAt || "",
		updatedAt: rawSys.updatedAt || "",
		locale: rawSys.locale || "en-US",
	};
}

function isContentfulEntry(obj: unknown): obj is Record<string, unknown> {
	return isRecord(obj) && "fields" in obj && "sys" in obj;
}
