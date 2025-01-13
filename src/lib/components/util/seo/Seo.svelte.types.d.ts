/**
 * Type definitions for the SEO component.
 */
export type SEOProps = {
	/** title of the page */
	title?: string;

	/** description of the page */
	description?: string;

	/** Keywords for the page */
	keywords?: string;

	/** Canonical URL for the page */
	canonical?: string;

	/** site name */
	siteName?: string;

	/** site slogan */
	siteSlogan?: string;

	/** URL of the main image for the page */
	imageURL?: string;

	/** URL of the logo image */
	logo?: string;

	/** author of the page */
	author?: string;

	/** name of the entity (e.g., person, organization) */
	name?: string;

	/**
	 * type of the schema (e.g., website, article).
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
	 * schema type(s) for the page.
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
	/** JSON-LD context, typically "https://schema.org". */
	"@context": string;

	/** type of the schema entity. */
	"@type": string | string[];

	/** name of the entity (e.g., person, organization). */
	name: string;

	/** URL of the entity or page. */
	url: string;

	/** URL of the main image. */
	image: string;

	/** logo of the entity as an ImageObject. */
	logo: {
		/** Specifies that the type is an ImageObject. */
		"@type": "ImageObject";

		/** URL of the logo. */
		url: string;

		/** width of the logo in pixels. */
		width: number;

		/** height of the logo in pixels. */
		height: number;
	};

	/** Social media URLs associated with the entity. */
	sameAs: string[];

	/** Additional JSON-LD properties. */
	[key: string]: unknown;
};
