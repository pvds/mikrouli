import { error } from "@sveltejs/kit";
import { SEO_DEFAULT } from "$config";
import navigationItems from "$data/generated/navigation.json";
import pageItems from "$data/generated/pages.json";
import postItems from "$data/generated/posts.json";
import reviewItems from "$data/generated/reviews.json";
import serviceItems from "$data/generated/services.json";
import type { JsonLdType, SEOProps } from "$global/seo/Seo.svelte.types";
import type {
	BaseEntry,
	BaseEntryRaw,
	BaseFieldsMinimal,
	NavigationEntry,
	PageEntry,
	PostEntry,
	ReviewEntry,
	ServiceEntry,
} from "$types/contentful";
import { getJsonLd } from "./jsonld";
import { markdownToHtml, splitText } from "./utils";

type ProcessedEntry<T extends BaseEntryRaw> = Omit<T, "fields"> & {
	fields: T["fields"] & Pick<BaseEntry["fields"], "contentSections">;
	prev?: BaseFieldsMinimal;
	next?: BaseFieldsMinimal;
};

const navigationData: NavigationEntry[] = navigationItems;
const pageData: BaseEntryRaw[] = pageItems;
const postData: BaseEntryRaw[] = postItems;
const reviewData: ReviewEntry[] = reviewItems;
const serviceData: BaseEntryRaw[] = serviceItems;

const preprocessJson = <T extends BaseEntryRaw>(
	data: T[],
): ProcessedEntry<T>[] => {
	return data.map((item) => ({
		...item,
		fields: {
			...item.fields,
			contentSections: [],
		},
		prev: undefined,
		next: undefined,
	}));
};

export const getSeo = (
	entry?: PageEntry | PostEntry | ServiceEntry,
	jsonLdType: JsonLdType = "WebPage",
	items: PostEntry[] | ServiceEntry[] = [],
): SEOProps => {
	if (!entry) return SEO_DEFAULT;
	const jsonld = getJsonLd(entry, jsonLdType, items);
	let category: string | undefined;
	switch (jsonLdType) {
		case "BlogPostPage":
			category = "Blog";
			break;
		case "ServicePage":
			category = "Services";
			break;
	}
	return {
		...SEO_DEFAULT,
		title: entry.fields.title,
		category,
		description: entry.fields.seoDescription,
		keywords: entry.fields.seoKeywords,
		index: entry.fields.seoIndex,
		jsonld: jsonld,
	};
};

export const getNavigation = (slug: string): NavigationEntry => {
	const nav = navigationData.find((n) => n.fields.slug === slug);

	if (!nav) throw error(404, `Navigation with slug '${slug}' not found`);
	nav.fields.items = nav.fields.items?.filter((item) => {
		return !item.hidden;
	});

	return nav;
};

export const getReviews = (limit = 0): ReviewEntry[] => {
	let reviews = reviewData;
	if (limit > 0) reviews = reviews.slice(0, limit);
	return reviews;
};

export const getPage = (slug: string): PageEntry => {
	const pages = preprocessJson(pageData);
	let page = pages.find((p) => p.fields.slug === slug);
	if (!page) throw error(404, `Page with slug '${slug}' not found`);

	const { children, ...restFields } = page.fields as Record<
		string,
		unknown
	> & { children?: unknown };
	page = { ...page, fields: restFields as PageEntry["fields"] };
	return processEntryMarkdown(page);
};

export const getPageEntries = (excluded?: string[]): { slug: string }[] => {
	const pages = pageData;
	return (
		pages
			?.filter((page) => !excluded?.includes(page.fields.slug))
			.map((page) => ({ slug: page.fields.slug })) || []
	);
};

export const getService = (slug: string): ServiceEntry => {
	const services = preprocessJson(serviceData);
	const service = services.find((s) => s.fields.slug === slug);

	if (!service) throw error(404, `Service with slug '${slug}' not found`);

	return processEntryMarkdown(service);
};

export const getServices = (exclude?: string): ServiceEntry[] => {
	let services = preprocessJson(serviceData);

	if (exclude)
		services = services.filter(
			(service) => service.fields.slug !== exclude,
		);
	services = services
		.filter((service) => !service.fields?.hidden)
		.map((service) => processEntryMarkdown(service));

	return services || [];
};

export const getServiceEntries = (): { slug: string }[] => {
	const services = serviceData;
	return services?.map((service) => ({ slug: service.fields.slug })) || [];
};

export const getPost = (slug: string): PostEntry => {
	const posts = preprocessJson(postData);
	const index = posts.findIndex((p) => p.fields.slug === slug);

	if (index === -1)
		throw error(404, `Blog post with slug '${slug}' not found`);
	const post = processEntryMarkdown(posts[index]);

	const minimalFields = (entry: PostEntry): BaseFieldsMinimal => ({
		title: entry.fields.title,
		header: entry.fields.header,
		slug: entry.fields.slug,
	});
	const prev = index > 0 ? minimalFields(posts[index - 1]) : undefined;
	const next =
		index < posts.length - 1 ? minimalFields(posts[index + 1]) : undefined;

	return {
		...post,
		prev,
		next,
	};
};

export const getPosts = (limit = 0): PostEntry[] => {
	let posts = preprocessJson(postData);
	posts = posts
		?.filter((post) => !post.fields?.hidden)
		.map((post) => processEntryMarkdown(post));
	if (limit > 0) posts = posts.slice(0, limit);

	return posts || [];
};

export const getPostEntries = (): { slug: string }[] => {
	const posts = postData;
	return posts?.map((post) => ({ slug: post.fields.slug })) || [];
};

function processEntryMarkdown<T extends BaseEntry>(entry: T): T {
	const sections = entry.fields.sections?.map((section, index) => ({
		...section,
		content: markdownToHtml(
			section.content,
			false,
			`heading-section-${index + 1}-`,
		),
	}));

	return {
		...entry,
		fields: {
			...entry.fields,
			intro: markdownToHtml(entry.fields.intro),
			contentSections: splitText(markdownToHtml(entry.fields.content)),
			sections,
			outro: markdownToHtml(entry.fields.outro),
		},
	};
}
