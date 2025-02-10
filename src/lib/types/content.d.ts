// Navigation

export type NavigationItem = {
	href: string;
	label: string;
	title?: string;
	target?: "_blank";
};

// Image

export type ImageMeta = {
	placeholder: string;
	width: string;
	height: string;
	hasAlpha: boolean;
};

// Booking

export type BookingCta = {
	text: string;
	textShort: string;
	textLong: string;
	classes?: string;
};

export type BookingType = "page" | "book" | "intake" | "session";

export type BookingOption = {
	cta: string;
	type: BookingType;
};

export type BookingOptions = {
	page: BookingOption;
	book: BookingOption;
	intake: BookingOption;
	session: BookingOption;
};
