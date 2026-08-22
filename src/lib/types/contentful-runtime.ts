export interface ContentfulFileData {
	url?: string;
	contentType?: string;
}

export interface ContentfulAssetData {
	fields?: {
		file?: ContentfulFileData;
	};
}

export interface ContentfulSysData {
	id?: string;
	type?: string;
	createdAt?: string;
	updatedAt?: string;
	locale?: string;
}

export interface ContentfulEntryData {
	sys?: ContentfulSysData;
	fields?: Record<string, unknown>;
}
