/**
 * @file This file contains the JSON-LD generator functions.
 *
 * @typedef {import('$types/contentful').PostEntry} PostEntry
 * @typedef {import('$types/contentful').PageEntry} PageEntry
 * @typedef {import('$types/contentful').ServiceEntry} ServiceEntry
 * @typedef {import('$global/seo/Seo.svelte.types').JsonLdType} JsonLdType
 *
 * // Schema-dts types:
 * @typedef {import('schema-dts').BlogPosting} BlogPosting
 * @typedef {import('schema-dts').WebPage} WebPage
 * @typedef {import('schema-dts').WebSite} WebSite
 * @typedef {import('schema-dts').Organization} Organization
 * @typedef {import('schema-dts').Service} Service
 * @typedef {import('schema-dts').CollectionPage} CollectionPage
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
 */

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
import {
	getAggregateRating,
	getImage,
	getOrganization,
	getOrgLogo,
	getParentUrl,
	iso8601Date,
} from "./jsonld.helpers.js";

/**
 * Generate JSON-LD based on the page type.
 * @param {PageEntry|PostEntry|ServiceEntry} entry - The entry data.
 * @param {JsonLdType} jsonLdType - The type of JSON-LD.
 * @param {PostEntry[]|ServiceEntry[]} [items=[]] - Optional array of items for collection pages.
 * @returns {ExtendedBlogPosting | ExtendedWebPage | ExtendedOrganization | ExtendedService | ExtendedCollectionPage | HomePage | undefined}
 */
export const getJsonLd = (entry, jsonLdType = "WebPage", items = []) => {
	let jsonld;
	switch (jsonLdType) {
		case "WebPage":
			jsonld = getPage(entry);
			break;
		case "HomePage":
			jsonld = getHomePage(entry);
			break;
		case "ServicesPage":
			jsonld = getServicesPage(entry, items);
			break;
		case "ServicePage":
			jsonld = getServicePage(entry);
			break;
		case "BlogPostPage":
			jsonld = getBlogPostPage(entry);
			break;
		case "BlogPage":
			jsonld = getBlogPage(entry, items);
			break;
		case "ContactPage":
			jsonld = getContactPage(entry);
			break;
		case "AboutPage":
			jsonld = getAboutPage(entry);
			break;
	}
	if (jsonld && !("@graph" in jsonld)) {
		// Extra global properties for all types except ones using @graph; these need to be
		// assigned in the appropriate type.
		jsonld.aggregateRating = getAggregateRating();
	}

	return jsonld;
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
		publisher: getOrganization(),
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
		provider: getOrganization(),
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
	const base = /** @type {ExtendedCollectionPage} */ (
		getBasePage(page, "CollectionPage")
	);
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
	const base = /** @type {ExtendedCollectionPage} */ (
		getBasePage(page, "CollectionPage")
	);
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

/**
 * Generate JSON-LD for the Homepage using @graph.
 * This returns a JSON-LD object with separate nodes for the WebSite and Organization.
 *
 * @param {PageEntry} page - The homepage entry data.
 * @returns {HomePage}
 */

// biome-ignore lint/correctness/noUnusedFunctionParameters: keep page parameter for future use
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
					item: extraCrumb
						? getParentUrl(extraCrumb.item)
						: defaultUrl,
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
