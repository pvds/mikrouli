export type ContentfulData = {
	navigation: Navigation[];
	page: Page[];
};

export type Page = {
	name: "Page";
	description: string;
	displayField: "title";
	fields: [
		TitleField,
		LongTitleField,
		SlugField,
		IntroField,
		SectionsField,
		LinksTitleField,
		LinksField,
	];
	sys: Sys;
};

export type Navigation = {
	name: "Navigation";
	description: string;
	displayField: "title";
	fields: [TitleField, ItemsField];
	sys: Sys;
};

type Validation = {
	unique?: boolean;
	linkContentType?: string[];
};

type Items = {
	type: "Link";
	validations?: Validation[];
	linkType: "Entry";
};

type BaseField = {
	id: string;
	name: string;
	type: "Symbol" | "Text" | "Array" | "Link";
	localized: boolean;
	required: boolean;
	validations: Validation[];
	disabled: boolean;
	omitted: boolean;
	items?: Items;
};

type TitleField = BaseField & {
	id: "title";
	name: "Title";
	required: true;
	validations: [Validation & { unique: true }];
};

type LongTitleField = BaseField & {
	id: "longTitle";
	name: "Long title";
	required: true;
	validations: [];
};

type SlugField = BaseField & {
	id: "slug";
	name: "Slug";
	required: false;
	validations: [Validation & { unique: true }];
};

type IntroField = BaseField & {
	id: "intro";
	name: "Intro";
	type: "Text";
	required: false;
	validations: [];
};

type SectionsField = BaseField & {
	id: "sections";
	name: "Sections";
	type: "Array";
	items: Items & {
		validations: [Validation & { linkContentType: ["content", "list"] }];
	};
};

type LinksTitleField = BaseField & {
	id: "linksTitle";
	name: "Links title";
	required: false;
	validations: [];
};

type LinksField = BaseField & {
	id: "links";
	name: "Links";
	type: "Array";
	items: Items & {
		validations: [Validation & { linkContentType: ["page", "link"] }];
	};
};

type SysLink = {
	sys: {
		type: "Link";
		linkType: string;
		id: string;
	};
};

type Sys = {
	space: SysLink;
	id: string;
	type: string;
	createdAt: string;
	updatedAt: string;
	environment: SysLink;
	publishedVersion: number;
	publishedAt: string;
	firstPublishedAt: string;
	createdBy: SysLink;
	updatedBy: SysLink;
	publishedCounter: number;
	version: number;
	publishedBy: SysLink;
	urn: string;
};
