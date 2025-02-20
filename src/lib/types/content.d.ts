// Navigation

export type NavigationItem = {
	href: string;
	label: string;
	title?: string;
	menuTitle?: string;
	target?: "_blank";
	items?: NavigationItem[];
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

// Call to Action

export type CtaIcon = "external" | "internal" | "calendar" | "dialog";
export type CtaTheme = "primary" | "secondary" | "tertiary";
export type CtaSize = "sm" | "md" | "lg";

// Section

export type SectionSize = "sm" | "md" | "lg";
export type SectionTheme =
	| "primary"
	| "primaryDark"
	| "secondary"
	| "secondaryDark"
	| "accent"
	| "accentDark"
	| "accentSoft"
	| "default";
