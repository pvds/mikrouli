export type Sys = {
	id: string;
	type: string;
	createdAt: string;
	updatedAt: string;
	locale: string;
};

// ### Pages

export type PageFields = {
	title: string;
	header: string;
	slug: string;
	intro: string;
	sections: SectionFields[];
};

export type PageEntry = {
	sys: Sys;
	fields: PageFields;
};

// ### Sections

export type SectionEntry = {
	sys: Sys;
	fields?: SectionFields;
};

export type SectionFields = {
	title: string;
	header?: string;
	content: string;
};

// ### Services

export type ServiceFields = {
	title: string;
	header?: string;
	slug: string;
	intro: string;
	sections: SectionFields[];
};

export type ServiceEntry = {
	sys: Sys;
	fields: ServiceFields;
};

// ### Posts

export type PostFields = {
	title: string;
	header?: string;
	slug: string;
	intro: string;
};

export type PostEntry = {
	sys: Sys;
	fields: PostFields;
};

// ### Navigations

export type NavigationFields = {
	title: string;
	items: PageFields[];
};

export type NavigationEntry = {
	sys: Sys;
	fields: NavigationFields;
};

// ### Data

export type ContentfulData = {
	navigation: NavigationEntry[];
	pages: PageEntry[];
	services: ServiceEntry[];
	posts: PostEntry[];
};
