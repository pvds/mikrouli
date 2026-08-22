import type {
	BlogPosting,
	CollectionPage,
	Organization,
	Service,
	WebPage,
	WebSite,
} from "schema-dts";
import {
	CONTACT_CITY,
	CONTACT_COUNTRY,
	CONTACT_EMAIL,
	CONTACT_PHONE,
	CONTACT_POSTAL,
	CONTACT_STREET,
	ORG_NAME,
	ORG_SAMEAS,
	ORG_VAT_ID,
	OWNER_IMAGE,
	OWNER_JOB_TITLE,
	OWNER_NAME,
	OWNER_SAMEAS,
	SITE_PREVIEW_URL,
	URL_BASE_PRODUCTION,
} from "$config";
import type { JsonLdType } from "$global/seo/Seo.svelte.types";
import type { PageEntry, PostEntry, ServiceEntry } from "$types/contentful";
import {
	getAggregateRating,
	getImage,
	getOrganization,
	getOrgLogo,
	getParentUrl,
	iso8601Date,
} from "./jsonld.helpers";

type AllowedPageTypes =
	| "WebPage"
	| "ContactPage"
	| "AboutPage"
	| "CollectionPage";
type HomePage = { "@context": string; "@graph": (WebSite | Organization)[] };
type ExtendedBlogPosting = BlogPosting & { "@context": string };
type ExtendedWebPage = WebPage & { "@context": string };
type ExtendedOrganization = Organization & { "@context": string };
type ExtendedService = Service & { "@context": string };
type ExtendedCollectionPage = CollectionPage & { "@context": string };

export const getJsonLd = (
	entry: PageEntry | PostEntry | ServiceEntry,
	jsonLdType: JsonLdType = "WebPage",
	items: PostEntry[] | ServiceEntry[] = [],
):
	| ExtendedBlogPosting
	| ExtendedWebPage
	| ExtendedOrganization
	| ExtendedService
	| ExtendedCollectionPage
	| HomePage
	| undefined => {
	let jsonld:
		| ExtendedBlogPosting
		| ExtendedWebPage
		| ExtendedOrganization
		| ExtendedService
		| ExtendedCollectionPage
		| HomePage
		| undefined;
	switch (jsonLdType) {
		case "WebPage":
			jsonld = getPage(entry as PageEntry);
			break;
		case "HomePage":
			jsonld = getHomePage(entry as PageEntry);
			break;
		case "ServicesPage":
			jsonld = getServicesPage(
				entry as PageEntry,
				items as ServiceEntry[],
			);
			break;
		case "ServicePage":
			jsonld = getServicePage(entry as ServiceEntry);
			break;
		case "BlogPostPage":
			jsonld = getBlogPostPage(entry as PostEntry);
			break;
		case "BlogPage":
			jsonld = getBlogPage(entry as PageEntry, items as PostEntry[]);
			break;
		case "ContactPage":
			jsonld = getContactPage(entry as PageEntry);
			break;
		case "AboutPage":
			jsonld = getAboutPage(entry as PageEntry);
			break;
	}
	if (jsonld && !("@graph" in jsonld)) {
		Object.assign(jsonld, { aggregateRating: getAggregateRating() });
	}

	return jsonld;
};

function getPage(page: PageEntry): ExtendedWebPage {
	return getBasePage(page, "WebPage");
}

function getContactPage(page: PageEntry): ExtendedWebPage {
	return getBasePage(page, "ContactPage");
}

function getAboutPage(page: PageEntry): ExtendedWebPage {
	return getBasePage(page, "AboutPage");
}

function getBlogPostPage(post: PostEntry): ExtendedWebPage {
	const blogData = {
		"@type": "BlogPosting",
		headline: post.fields.header,
		description: post.fields.seoDescription,
		datePublished: iso8601Date(post.meta.createdAt),
		dateModified: iso8601Date(post.meta.updatedAt),
		author: {
			"@type": "Person",
			name: OWNER_NAME,
		},
		publisher: getOrganization(),
		image: getImage(post.fields.heroImage),
	};
	const base = getBasePage(post, "WebPage", {
		name: post.fields.header || post.fields.title,
		item: `${URL_BASE_PRODUCTION}/blog/${post.fields.slug}`,
	}) as ExtendedWebPage;
	Object.assign(base, { mainEntity: blogData });
	return base;
}

function getServicePage(service: ServiceEntry): ExtendedWebPage {
	const serviceData = {
		"@type": "Service",
		name: service.fields.title,
		description: service.fields.seoDescription,
		serviceType: "Therapy",
		provider: getOrganization(),
		image: getImage(service.fields.heroImage),
	};
	const base = getBasePage(service, "WebPage", {
		name: service.fields.title,
		item: `${URL_BASE_PRODUCTION}/services/${service.fields.slug}`,
	}) as ExtendedWebPage;
	Object.assign(base, { mainEntity: serviceData });
	return base;
}

function getBlogPage(
	page: PageEntry,
	posts: PostEntry[],
): ExtendedCollectionPage {
	const base = getBasePage(page, "CollectionPage") as ExtendedCollectionPage;
	if (posts.length) {
		base.hasPart = posts.map((post) => ({
			"@type": "BlogPosting",
			headline: post.fields.header,
			description: post.fields.seoDescription,
			datePublished: iso8601Date(post.meta.createdAt),
			dateModified: iso8601Date(post.meta.updatedAt),
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": `${URL_BASE_PRODUCTION}/blog/${post.fields.slug}`,
			},
		}));
	}
	return base;
}

function getServicesPage(
	page: PageEntry,
	services: ServiceEntry[],
): ExtendedCollectionPage {
	const base = getBasePage(page, "CollectionPage") as ExtendedCollectionPage;
	if (services.length) {
		base.hasPart = services.map((service) => ({
			"@type": "WebPage",
			name: service.fields.title,
			description: service.fields.seoDescription,
			mainEntity: {
				"@type": "Service",
				name: service.fields.title,
				description: service.fields.seoDescription,
				serviceType: "Therapy",
				provider: getOrganization(),
				image: getImage(service.fields.heroImage),
			},
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": `${URL_BASE_PRODUCTION}/services/${service.fields.slug}`,
			},
		}));
	}
	return base;
}

// biome-ignore lint/correctness/noUnusedFunctionParameters: keep page parameter for future use
function getHomePage(page: PageEntry): HomePage {
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebSite",
				"@id": `${URL_BASE_PRODUCTION}/#website`,
				url: URL_BASE_PRODUCTION,
				name: ORG_NAME,
				image: `${URL_BASE_PRODUCTION}/${SITE_PREVIEW_URL}`,
				publisher: {
					"@id": `${URL_BASE_PRODUCTION}/#organization`,
				},
				aggregateRating: getAggregateRating(),
			},
			{
				"@type": "Organization",
				"@id": `${URL_BASE_PRODUCTION}/#organization`,
				name: ORG_NAME,
				url: URL_BASE_PRODUCTION,
				logo: getOrgLogo(),
				sameAs: ORG_SAMEAS,
				founder: [
					{
						"@type": "Person",
						name: OWNER_NAME,
						jobTitle: OWNER_JOB_TITLE,
						worksFor: {
							"@type": "Organization",
							name: ORG_NAME,
							url: URL_BASE_PRODUCTION,
						},
						sameAs: OWNER_SAMEAS,
						image: `${URL_BASE_PRODUCTION}/${OWNER_IMAGE}`,
						alumniOf: [
							{
								"@type": "EducationalOrganization",
								name: "University of Athens",
							},
							{
								"@type": "EducationalOrganization",
								name: "Leiden University",
							},
						],
						knowsAbout: [
							"Systemic Therapy",
							"Family Therapy",
							"Mental Health",
						],
					},
				],
				telephone: CONTACT_PHONE,
				email: CONTACT_EMAIL,
				address: {
					"@type": "PostalAddress",
					streetAddress: CONTACT_STREET,
					addressLocality: CONTACT_CITY,
					postalCode: CONTACT_POSTAL,
					addressCountry: CONTACT_COUNTRY,
				},
				vatID: ORG_VAT_ID,
			},
		],
	};
}

function getBasePage(
	page: PageEntry,
	pageType: AllowedPageTypes,
	extraCrumb?: { name: string; item: string },
): ExtendedWebPage | ExtendedCollectionPage {
	const defaultUrl = `${URL_BASE_PRODUCTION}/${page.fields.slug}`;
	const canonicalUrl = extraCrumb ? extraCrumb.item : defaultUrl;
	const base: ExtendedWebPage | ExtendedCollectionPage = {
		"@context": "https://schema.org",
		"@type": pageType,
		name: page.fields.title,
		description: page.fields.seoDescription,
		url: canonicalUrl,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": canonicalUrl,
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: `${URL_BASE_PRODUCTION}/`,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: page.fields.title,
					item: extraCrumb
						? getParentUrl(extraCrumb.item)
						: defaultUrl,
				},
			],
		},
	};
	const breadcrumb = base.breadcrumb;
	if (
		extraCrumb &&
		breadcrumb &&
		typeof breadcrumb === "object" &&
		"itemListElement" in breadcrumb &&
		Array.isArray(breadcrumb.itemListElement)
	) {
		breadcrumb.itemListElement.push({
			"@type": "ListItem",
			position: breadcrumb.itemListElement.length + 1,
			name: extraCrumb.name,
			item: extraCrumb.item,
		});
	}
	return base;
}
