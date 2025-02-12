/**
 * Type definitions for the SEO component.
 */
export type SEOProps = {
	/**
	 * The title of the page.
	 * - Optimal length: **50–60 characters**.
	 * - Avoid exceeding 60 characters to prevent truncation in SERPs.
	 * @default ""
	 */
	title?: string;

	/**
	 * The category of the page.
	 * - Use to categorize the page content for SEO purposes.
	 * - Often this is the parent page, such as "Blog" for blog posts.
	 * @default ""
	 */
	category?: string;

	/**
	 * Helps to construct the title.
	 * @default undefined
	 */
	titleConstructor?: () => string;

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

/**
 * The type of json-ld data to include in the structured data.
 *
 * NB. This is not an exact mapping of the schema.org types.
 */
export type JsonLdType =
	| "WebPage"
	| "HomePage"
	| "ContactPage"
	| "AboutPage"
	| "BlogPage"
	| "BlogPostPage"
	| "ServicesPage"
	| "ServicePage"
	| "Organization";
