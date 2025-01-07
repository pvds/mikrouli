export type Metadata = {
	tags: unknown[];
	concepts: unknown[];
};

export type SysLink = {
	sys: {
		type: string;
		linkType: string;
		id: string;
	};
};

export type Sys = {
	space: SysLink;
	id: string;
	type: string;
	createdAt: string;
	updatedAt: string;
	environment: SysLink;
	publishedVersion: number;
	revision: number;
	contentType: SysLink;
	locale: string;
};

export type PageFields = {
	title: string;
	longTitle: string;
	slug: string;
	intro: string;
};

export type PageEntry = {
	metadata: Metadata;
	sys: Sys;
	fields: PageFields;
};

export type ServiceFields = {
	title: string;
	longTitle: string;
	slug: string;
	intro: string;
};

export type ServiceEntry = {
	metadata: Metadata;
	sys: Sys;
	fields: ServiceFields;
};

export type PostFields = {
	title: string;
	slug: string;
	intro: string;
};

export type PostEntry = {
	metadata: Metadata;
	sys: Sys;
	fields: PostFields;
};

export type NavigationFields = {
	title: string;
	items: PageEntry[];
};

export type NavigationEntry = {
	metadata: Metadata;
	sys: Sys;
	fields: NavigationFields;
};

export type ContentfulData = {
	navigation: NavigationEntry[];
	pages: PageEntry[];
	services: PageEntry[];
	posts: PageEntry[];
};
