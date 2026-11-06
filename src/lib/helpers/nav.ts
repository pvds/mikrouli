import type { NavigationItem } from "#types/content.ts";
import type { NavigationFieldItems } from "#types/contentful.ts";
import { resolve } from "$app/paths";

export const toNavItems = (
	navItems: NavigationFieldItems[],
): NavigationItem[] =>
	navItems
		.filter(({ hidden }) => !hidden)
		.map(({ title, menuTitle, longTitle, url, isExternal, items }) => ({
			href: isExternal ? url : resolve(url),
			label: title,
			menuTitle,
			title: title === longTitle ? "" : longTitle,
			target: isExternal ? "_blank" : undefined,
			items: items
				?.filter(({ hidden }) => !hidden)
				.map(({ title, longTitle, url, isExternal }) => ({
					href: isExternal ? url : resolve(url),
					label: title,
					title: title === longTitle ? "" : longTitle,
					target: isExternal ? "_blank" : undefined,
				})),
		}));
