/**
 * Type definitions for the SEO component.
 */
export type SEOProps = {
	/** The title of the page */
	title?: string;

	/** The title parent of the page */
	titleSlogan?: string;

	/** The description of the page */
	description?: string;

	/** Keywords for the page */
	keywords?: string;

	/** Canonical URL for the page */
	canonical?: string;

	/** The site name */
	siteName?: string;

	/** The URL of the main image for the page */
	imageURL?: string;

	/** The URL of the logo image */
	logo?: string;

	/** The author of the page */
	author?: string;

	/** The name of the entity (e.g., person, organization) */
	name?: string;

	/**
	 * The type of the schema (e.g., website, article).
	 * @default "website"
	 */
	type?: string;

	/**
	 * Whether the page should be indexed by search engines.
	 * @default true
	 */
	index?: boolean;

	/**
	 * Whether Twitter metadata should be included.
	 * @default false
	 */
	twitter?: boolean;

	/**
	 * Whether Open Graph metadata should be included.
	 * @default false
	 */
	openGraph?: boolean;

	/**
	 * Whether to include schema.org structured data.
	 * @default false
	 */
	schemaOrg?: boolean;

	/**
	 * The schema type(s) for the page.
	 * @default ["Person", "Organization"]
	 */
	schemaType?: string[];

	/**
	 * Social media URLs associated with the page or entity.
	 * @default []
	 */
	socials?: string[];

	/** Additional JSON-LD data to include in the structured data */
	jsonld?: SeoLinkedData;
};

export type SeoLinkedData = {
	/** The JSON-LD context, typically "https://schema.org". */
	"@context": string;

	/** The type of the schema entity. */
	"@type": string | string[];

	/** The name of the entity (e.g., person, organization). */
	name: string;

	/** The URL of the entity or page. */
	url: string;

	/** The URL of the main image. */
	image: string;

	/** The logo of the entity as an ImageObject. */
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

	/** Social media URLs associated with the entity. */
	sameAs: string[];

	/** Additional JSON-LD properties. */
	[key: string]: unknown;
};
