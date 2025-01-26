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
	sections: string[];
};

export type BaseEntry = {
	meta: Metadata;
	fields: BaseFields;
};

export type BaseEntryNested = {
	meta?: Metadata;
	fields: BaseFields;
};

// ### ImageField

// TODO: remove unnecessary properties
export type ImageField = {
	title: string;
	description: string;
	file: {
		url: string;
		details: {
			size: number;
			image: {
				width: number;
				height: number;
			};
		};
		fileName: string;
		contentType: string;
	};
};

// ### Pages
export type PageFields = BaseFields & {};

export type PageEntry = {
	meta: Metadata;
	fields: PageFields;
};

// ### Services
export type ServiceFields = BaseFields & {};
export type ServiceEntry = {
	meta: Metadata;
	fields: ServiceFields;
};

// ### Posts
export type PostFields = BaseFields & {
	heroImage?: ImageField;
};
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
	images: string[];
};
