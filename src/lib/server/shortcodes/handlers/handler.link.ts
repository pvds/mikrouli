import { BUTTON_THEME } from "$config";
import type { CtaTheme } from "$types/content";
import { svgIcon } from "../../../helpers/icon";
import { isExternalUrl } from "../../../helpers/url";

interface Attributes {
	url: string;
	text: string;
	variant?: CtaTheme;
}

export function linkHandler(attributes: Record<string, string>): string {
	const {
		url,
		text,
		variant = "secondary",
	} = attributes as unknown as Attributes;
	if (!url || !text) return "";

	const isExternal = isExternalUrl(url);
	if (isExternal === null) return "";
	const externalAttributes = isExternal
		? ' target="_blank" rel="noopener noreferrer"'
		: "";
	const externalIcon = isExternal ? svgIcon("external") : svgIcon("internal");

	const variants: Record<string, string> = {
		primary: `px-4 no-underline ${BUTTON_THEME.primary}`,
		secondary: `px-4 no-underline ${BUTTON_THEME.secondary}`,
		tertiary: `${BUTTON_THEME.tertiary}`,
	};
	const baseClasses =
		"shortcode-link group [&+a]:ml-4 inline-block py-2 text-base font-semibold transition-all";
	const variantClasses = variants[variant] || variants.secondary;
	const classes = `${baseClasses} ${variantClasses}`;

	return `<a href="${url}" class="${classes}" ${externalAttributes}>${text}${externalIcon}</a>`.trim();
}
