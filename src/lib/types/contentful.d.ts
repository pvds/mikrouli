export type Metadata = {
	id: string;
	type: string;
	createdAt: string;
	updatedAt: string;
	locale: string;
};

// ### Base
export type BaseFields = {
	title: string;
	slug: string;
	seoDescription: string;
	seoKeywords?: string;
	seoIndex: boolean;
	header?: string;
	intro: string;
	content?: string;
	contentSections: string[];
	/**
	 * @deprecated Use `contentSections` instead.
	 */
	sections: SectionFields[];
};

// ### Pages
export type PageFields = BaseFields & {};

export type PageEntry = {
	meta: Metadata;
	fields: PageFields;
};

// ### Sections
export type SectionEntry = {
	meta: Metadata;
	fields?: SectionFields;
};
export type SectionFields = {
	title: string;
	header?: string;
	content: string;
};

// ### Services
export type ServiceFields = BaseFields & {};
export type ServiceEntry = {
	meta: Metadata;
	fields: ServiceFields;
};

// ### Posts
export type PostFields = BaseFields & {};
export type PostEntry = {
	meta: Metadata;
	fields: PostFields;
};

// ### Navigations
export type NavigationPageFields = Pick<PageFields, "title" | "header" | "slug">;
export type NavigationFields = {
	title: string;
	slug: string;
	items: NavigationPageFields[];
};
export type NavigationEntry = {
	meta: Metadata;
	fields: NavigationFields;
};

// ### Data
export type ContentfulData = {
	navigation: NavigationEntry[];
	pages: PageEntry[];
	services: ServiceEntry[];
	posts: PostEntry[];
};
