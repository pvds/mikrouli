export type Metadata = {
	tags: unknown[];
	concepts: unknown[];
};

export type SysLink = {
	sys: {
		type: "Link";
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

export type NavigationItem = {
	metadata: Metadata;
	sys: Sys;
	fields: PageFields;
};

export type NavigationFields = {
	title: string;
	items: NavigationItem[];
};

export type NavigationEntry = {
	metadata: Metadata;
	sys: Sys;
	fields: NavigationFields;
};

export type ContentfulData = {
	navigation: NavigationEntry[];
	pages: NavigationItem[];
};
