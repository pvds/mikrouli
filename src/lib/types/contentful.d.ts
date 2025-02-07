export type Metadata = {
	id: string;
	type: string;
	createdAt: string;
	updatedAt: string;
	locale: string;
};

// ### Base

export type BaseFieldsRaw = {
	title: string;
	slug: string;
	seoDescription: string;
	seoKeywords?: string;
	seoIndex: boolean;
	hidden?: boolean;
	header?: string;
	intro: string;
	content?: string;
	sections?: SectionFields[];
	outro?: string;
};

export type BaseFields = BaseFieldsRaw & {
	contentSections: string[];
	sections?: SectionFields[];
};

export type BaseFieldsMinimal = Pick<BaseFieldsRaw, "title" | "header" | "slug" | "hidden">;

export type BaseEntryRaw = {
	meta: Metadata;
	fields: BaseFieldsRaw;
};

export type BaseEntry = {
	meta: Metadata;
	fields: BaseFields;
};

// ### Section

export type SectionFields = {
	title: string;
	header?: string;
	content: string;
	image?: ImageField;
};

/**
 * A SectionEntry represents the raw nested entry.
 * (After processing in content.js, only the SectionFields are kept.)
 */
export type SectionEntry = {
	meta: Metadata;
	fields: SectionFields;
};

// ### ImageField

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

export type PageFields = BaseFields;

export type PageEntry = {
	meta: Metadata;
	fields: PageFields;
};

// ### Services

export type ServiceFields = BaseFields & {
	heroImage?: ImageField;
};

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
	prev?: BaseFieldsMinimal;
	next?: BaseFieldsMinimal;
};

// ### Navigations

export type NavigationFields = {
	title: string;
	slug: string;
	items: BaseFieldsMinimal[];
};

export type NavigationEntry = {
	meta: Metadata;
	fields: NavigationFields;
};

// ### Reviews

export type ReviewFields = {
	reviewer?: string;
	anonymous: boolean;
	age?: number;
	nationality?: string;
	review: string;
	rating: number;
};

export type ReviewEntry = {
	meta: Metadata;
	fields: ReviewFields;
};

// ### Data
export type ContentfulData = {
	navigation: NavigationEntry[];
	pages: PageEntry[];
	services: ServiceEntry[];
	posts: PostEntry[];
	reviews: ReviewEntry[];
	images: string[];
};
