/**
 * Type definitions for the SEO component.
 */
export type SEOProps = {
	/**
	 * The title of the page.
	 * - Optimal length: **50–60 characters**.
	 * - Avoid exceeding 60 characters to prevent truncation in SERPs.
	 *
	 * @default ""
	 */
	title?: string;

	/**
	 * Helps to construct the title.
	 * @default undefined
	 */
	titleConstructor?: () => string;

	/**
	 * The title parent of the page.
	 * - Often used as a tagline; keep it short (typically under **40 characters**).
	 *
	 * @default ""
	 */
	titleSlogan?: string;

	/**
	 * The description of the page.
	 * - Optimal length: **50–160 characters** (recommended around 70–155 characters).
	 * - Make it engaging and unique to improve click‐through rates.
	 *
	 * @default ""
	 */
	description?: string;

	/**
	 * Keywords for the page.
	 * - Although meta keywords are less influential today, keep a concise list
	 *   (typically **3–5** highly relevant keywords) if used.
	 *
	 * @default ""
	 */
	keywords?: string;

	/**
	 * Canonical URL for the page.
	 * - Must be an **absolute URL** representing the preferred version of the page.
	 *
	 * @default ""
	 */
	canonical?: string;

	/**
	 * The site name.
	 * - Use the consistent brand or site name across pages.
	 *
	 * @default ""
	 */
	siteName?: string;

	/**
	 * The URL of the main image for the page.
	 * - Optimal dimensions: around **1200×630 pixels** (or a 1.91:1 ratio) for social sharing.
	 *
	 * @default ""
	 */
	imageURL?: string;

	/**
	 * The URL of the logo image.
	 * - The logo should be clear and optimized; typical dimensions vary, often around **400×400 pixels**.
	 *
	 * @default ""
	 */
	logo?: string;

	/**
	 * The author of the page.
	 *
	 * - Should reflect the responsible entity (individual or organization) and remain consistent.
	 *
	 * @default ""
	 */
	author?: string;

	/**
	 * The name of the entity (e.g., person, organization).
	 *
	 * - Keep concise and accurate; used in structured data for rich search results.
	 *
	 * @default ""
	 */
	name?: string;

	/**
	 * The type of the schema (e.g., website, article).
	 *
	 * - Generally use `"website"` for home pages and `"article"` for blog posts.
	 * - Ensure this matches your content type.
	 *
	 * @default "website"
	 */
	type?: string;

	/**
	 * Whether the page should be indexed by search engines.
	 * - Set to `false` for pages you want to keep out of search results (e.g., staging pages).
	 *
	 * @default true
	 */
	index?: boolean;

	/**
	 * Whether Twitter metadata should be included.
	 * - Enable if you want to optimize Twitter Card display.
	 *
	 * @default false
	 */
	twitter?: boolean;

	/**
	 * Whether Open Graph metadata should be included.
	 * - Enable to improve social sharing previews on platforms such as Facebook and LinkedIn.
	 *
	 * @default false
	 */
	openGraph?: boolean;

	/**
	 * Whether to include schema.org structured data.
	 * - Enable to help search engines understand your content and boost rich results.
	 *
	 * @default false
	 */
	schemaOrg?: boolean;

	/**
	 * The schema type(s) for the page.
	 * - Common values include `"Person"` or `"Organization"`. Usually one type suffices.
	 *
	 * @default ["Person", "Organization"]
	 */
	schemaType?: string[];

	/**
	 * Social media URLs associated with the page or entity.
	 * - Should be full, valid URLs for each social platform (e.g., Facebook, Twitter).
	 *
	 * @default []
	 */
	socials?: string[];

	/**
	 * Additional JSON-LD data to include in the structured data.
	 * - Use to extend the schema.org markup with custom properties if needed.
	 *
	 * @default {}
	 */
	jsonld?: object;

	/**
	 * Renderable children for the component.
	 */
	children?: import("svelte").Snippet;
};

export type SeoLinkedData = {
	/**
	 * The JSON-LD context, typically "https://schema.org".
	 * - Always use the standard context unless you require customization.
	 */
	"@context": string;

	/**
	 * The type of the schema entity.
	 * - Use one or more types that best represent the content (e.g., "Website", "Article").
	 */
	"@type": string | string[];

	/**
	 * The name of the entity (e.g., person, organization).
	 * - Should be concise, descriptive, and match the entity in your content.
	 */
	name: string;

	/**
	 * The URL of the entity or page.
	 * - Must be an absolute URL.
	 */
	url: string;

	/**
	 * The URL of the main image.
	 * - The image should meet recommended dimensions (e.g., 1200×630 pixels for social sharing).
	 */
	image: string;

	/**
	 * The logo of the entity as an ImageObject.
	 * - Provide an ImageObject with the logo’s URL and its dimensions. Ensure the logo is clear.
	 */
	logo: {
		/** Specifies that the type is an ImageObject. */
		"@type": "ImageObject";

		/** The URL of the logo. */
		url: string;

		/** The width of the logo in pixels. */
		width: number;

		/** The height of the logo in pixels. */
		height: number;
	};

	/**
	 * Social media URLs associated with the entity.
	 * - List all relevant social media profile URLs.
	 */
	sameAs: string[];

	/**
	 * Additional JSON-LD properties.
	 * - Use for any extra structured data you need to describe your content further.
	 */
	[key: string]: unknown;
};

export type JsonLdType =
	| "BlogPosting"
	| "Organization"
	| "Service"
	| "ContactPage"
	| "AboutPage"
	| "WebPage"
	| "BlogCollection"
	| "ServiceCollection";
