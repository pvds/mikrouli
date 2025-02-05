/**
 * @file This file contains functions to fetch and process content data.
 *
 * @typedef {import('$types/contentful').PostEntry} PostEntry
 * @typedef {import('$types/contentful').PageEntry} PageEntry
 * @typedef {import('$types/contentful').ServiceEntry} ServiceEntry
 * @typedef {import('$types/contentful').ImageField} ImageField
 * @typedef {import('$global/seo/Seo.svelte.types').SEOProps} SEOProps
 * @typedef {import('$global/seo/Seo.svelte.types').JsonLdType} JsonLdType
 *
 * // Schema-dts types:
 * @typedef {import('schema-dts').BlogPosting} BlogPosting
 * @typedef {import('schema-dts').WebPage} WebPage
 * @typedef {import('schema-dts').WebSite} WebSite
 * @typedef {import('schema-dts').Organization} Organization
 * @typedef {import('schema-dts').Service} Service
 * @typedef {import('schema-dts').CollectionPage} CollectionPage
 * @typedef {import('schema-dts').ImageObject} ImageObject
 * @typedef {import('schema-dts').BreadcrumbList} BreadcrumbList
 * @typedef {import('schema-dts').CreativeWork} CreativeWork
 * @typedef {import('schema-dts').ListItem} ListItem
 *
 * // Allowed values for page type.
 * @typedef {"WebPage" | "ContactPage" | "AboutPage" | "CollectionPage"} AllowedPageTypes
 *
 * // Homepage
 * @typedef {{ "@context": string, "@graph": (WebSite | Organization)[] }} HomePage
 *
 * // Extended types (we add a "@context" property)
 * @typedef {BlogPosting & { "@context": string }} ExtendedBlogPosting
 * @typedef {WebPage & { "@context": string }} ExtendedWebPage
 * @typedef {Organization & { "@context": string }} ExtendedOrganization
 * @typedef {Service & { "@context": string }} ExtendedService
 * @typedef {CollectionPage & { "@context": string }} ExtendedCollectionPage
 * @typedef {ImageObject & { "@context": string }} ExtendedImageObject
 */

import {
	CONTACT_CITY,
	CONTACT_COUNTRY,
	CONTACT_EMAIL,
	CONTACT_PHONE,
	CONTACT_POSTAL,
	CONTACT_STREET,
	IMAGE_EXT,
	IMAGE_THUMBNAIL_SIZE,
	ORG_LINKEDIN,
	ORG_LOGO_URL,
	ORG_NAME,
	ORG_TWITTER,
	ORG_VAT_ID,
	OWNER_IMAGE,
	OWNER_JOB_TITLE,
	OWNER_LINKEDIN,
	OWNER_NAME,
	OWNER_TWITTER,
	SITE_PREVIEW_URL,
	URL_BASE_PRODUCTION,
} from "$config";
import { getImageName } from "../helpers/image.js";

/**
 * Generate JSON-LD based on the page type.
 * @param {PageEntry|PostEntry|ServiceEntry} entry - The entry data.
 * @param {JsonLdType} jsonLdType - The type of JSON-LD.
 * @param {PostEntry[]|ServiceEntry[]} [items=[]] - Optional array of items for collection pages.
 * @returns {ExtendedBlogPosting | ExtendedWebPage | ExtendedOrganization | ExtendedService | ExtendedCollectionPage | HomePage | undefined}
 */
export const getJsonLd = (entry, jsonLdType = "WebPage", items = []) => {
	switch (jsonLdType) {
		case "WebPage":
			return getPage(entry);
		case "HomePage":
			return getHomePage(entry);
		case "ServicesPage":
			return getServicesPage(entry, items);
		case "ServicePage":
			return getServicePage(entry);
		case "BlogPostPage":
			return getBlogPostPage(entry);
		case "BlogPage":
			return getBlogPage(entry, items);
		case "ContactPage":
			return getContactPage(entry);
		case "AboutPage":
			return getAboutPage(entry);
		default:
			return undefined;
	}
};

/**
 * Generate JSON-LD for a generic WebPage.
 * @param {PageEntry} page - The page entry.
 * @returns {ExtendedWebPage}
 */
function getPage(page) {
	return getBasePage(page, "WebPage");
}

/**
 * Generate JSON-LD for a Contact Page.
 * @param {PageEntry} page - The page entry.
 * @returns {ExtendedWebPage}
 */
function getContactPage(page) {
	return getBasePage(page, "ContactPage");
}

/**
 * Generate JSON-LD for an About Page.
 * @param {PageEntry} page - The page entry.
 * @returns {ExtendedWebPage}
 */
function getAboutPage(page) {
	return getBasePage(page, "AboutPage");
}

/**
 * Generate JSON-LD for an individual Blog Post page.
 * The output is a WebPage with breadcrumb and a mainEntity that is a BlogPosting.
 * @param {PostEntry} post - The blog post entry.
 * @returns {ExtendedWebPage}
 */
function getBlogPostPage(post) {
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
		publisher: {
			"@type": "Organization",
			name: ORG_NAME,
			logo: {
				"@type": "ImageObject",
				url: `${URL_BASE_PRODUCTION}/${ORG_LOGO_URL}`,
			},
		},
		image: getImage(post.fields.heroImage),
	};
	// Pass an extra breadcrumb item (e.g. the blog post title) as the third crumb.
	/** @type {ExtendedWebPage} */
	const base = getBasePage(post, "WebPage", {
		name: post.fields.header || post.fields.title,
		item: `${URL_BASE_PRODUCTION}/blog/${post.fields.slug}`,
	});
	// Use a simple cast to bypass the type error.
	base.mainEntity = /** @type {any} */ (blogData);
	return base;
}

/**
 * Generate JSON-LD for an individual Service page.
 * The output is a WebPage with breadcrumb and a mainEntity that is a Service.
 * @param {ServiceEntry} service - The service entry.
 * @returns {ExtendedWebPage}
 */
function getServicePage(service) {
	const serviceData = {
		"@type": "Service",
		name: service.fields.title,
		description: service.fields.seoDescription,
		serviceType: "Therapy",
		provider: {
			"@type": "Organization",
			name: ORG_NAME,
			url: URL_BASE_PRODUCTION,
			logo: {
				"@type": "ImageObject",
				url: `${URL_BASE_PRODUCTION}/${ORG_LOGO_URL}`,
			},
		},
		image: getImage(service.fields.heroImage),
	};
	/** @type {ExtendedWebPage} */
	const base = getBasePage(service, "WebPage", {
		name: service.fields.title,
		item: `${URL_BASE_PRODUCTION}/services/${service.fields.slug}`,
	});
	base.mainEntity = /** @type {any} */ (serviceData);
	return base;
}

/**
 * Generate JSON-LD for a Blog Collection page.
 * @param {PageEntry} page - The blog overview page entry.
 * @param {PostEntry[]} posts - An array of blog posts.
 * @returns {ExtendedCollectionPage}
 */
function getBlogPage(page, posts) {
	/** @type {ExtendedCollectionPage} */
	const base = /** @type {ExtendedCollectionPage} */ (getBasePage(page, "CollectionPage"));
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

/**
 * Generate JSON-LD for a Service Collection page.
 * Each service is now wrapped in a WebPage whose mainEntity is a Service.
 * @param {PageEntry} page - The services overview page entry.
 * @param {ServiceEntry[]} services - An array of services.
 * @returns {ExtendedCollectionPage}
 */
function getServicesPage(page, services) {
	/** @type {ExtendedCollectionPage} */
	const base = /** @type {ExtendedCollectionPage} */ (getBasePage(page, "CollectionPage"));
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
				provider: {
					"@type": "Organization",
					name: ORG_NAME,
					url: URL_BASE_PRODUCTION,
					logo: {
						"@type": "ImageObject",
						url: `${URL_BASE_PRODUCTION}/${ORG_LOGO_URL}`,
					},
				},
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

/**
 * Generate JSON-LD for the Homepage using @graph.
 * This returns a JSON-LD object with separate nodes for the WebSite and Organization.
 *
 * @param {PageEntry} page - The homepage entry data.
 * @returns {HomePage}
 */
function getHomePage(page) {
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
			},
			{
				"@type": "Organization",
				"@id": `${URL_BASE_PRODUCTION}/#organization`,
				name: ORG_NAME,
				url: URL_BASE_PRODUCTION,
				logo: {
					"@type": "ImageObject",
					url: `${URL_BASE_PRODUCTION}/${ORG_LOGO_URL}`,
					width: {
						"@type": "QuantitativeValue",
						value: 48,
						unitText: "pixels",
					},
					height: {
						"@type": "QuantitativeValue",
						value: 48,
						unitText: "pixels",
					},
				},
				sameAs: [ORG_TWITTER, ORG_LINKEDIN],
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
						sameAs: [OWNER_LINKEDIN, OWNER_TWITTER],
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
						knowsAbout: ["Systemic Therapy", "Family Therapy", "Mental Health"],
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

/**
 * Generate the base JSON‑LD for a page.
 * Returns a WebPage with a breadcrumb list.
 *
 * @param {PageEntry} page - The page entry.
 * @param {AllowedPageTypes} pageType - The specific page type.
 * @param {{name: string, item: string}} [extraCrumb] - Optional extra breadcrumb item.
 * @returns {ExtendedWebPage | ExtendedCollectionPage}
 */
function getBasePage(page, pageType, extraCrumb) {
	const defaultUrl = `${URL_BASE_PRODUCTION}/${page.fields.slug}`;
	const canonicalUrl = extraCrumb ? extraCrumb.item : defaultUrl;
	/** @type {ExtendedWebPage | ExtendedCollectionPage} */
	const base = {
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
					item: extraCrumb ? getParentUrl(extraCrumb.item) : defaultUrl,
				},
			],
		},
	};
	// @ts-expect-error
	const breadCrumbList = base.breadcrumb?.itemListElement;
	if (extraCrumb && breadCrumbList?.length) {
		breadCrumbList.push({
			"@type": "ListItem",
			position: breadCrumbList.length + 1,
			name: extraCrumb.name,
			item: extraCrumb.item,
		});
	}
	return base;
}

/**
 * Remove milliseconds from the date string.
 * @param {string} date - The date string.
 * @return {string} The date string without milliseconds.
 */
function iso8601Date(date) {
	return date.replace(/\.\d{3}Z$/, "Z");
}

/**
 * Get the image object for JSON-LD.
 * @param {ImageField|undefined} image
 * @return {ExtendedImageObject|undefined}
 */
function getImage(image) {
	return image
		? {
				"@context": "https://schema.org",
				"@type": "ImageObject",
				url: `${URL_BASE_PRODUCTION}/images/cms/${getImageName(image.file.fileName)}-${IMAGE_THUMBNAIL_SIZE}.${IMAGE_EXT}`,
			}
		: undefined;
}

/**
 * Helper function to get the parent URL by removing its last segment.
 * For example, given "https://example.com/blog/post", it returns "https://example.com/blog".
 * @param {string} url - The full URL.
 * @returns {string} - The parent URL.
 */
function getParentUrl(url) {
	return url.split("/").slice(0, -1).join("/");
}
