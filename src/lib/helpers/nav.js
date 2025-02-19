import { base } from "$app/paths";

/**
 * @typedef {import('$types/contentful').NavigationFieldItems} NavigationFieldItems
 * @typedef {import('$types/content').NavigationItem} NavigationItem
 */

/**
 * Converts Contentful navigation items to an array of NavItem objects
 * @param {NavigationFieldItems[]} navItems
 * @returns {NavigationItem[]}
 */
export const toNavItems = (navItems) =>
	navItems
		.filter(({ hidden }) => !hidden)
		.map(({ title, longTitle, url, isExternal, items }) => ({
			href: isExternal ? url : `${base}/${url}`,
			label: title,
			title: title === longTitle ? "" : longTitle,
			target: isExternal ? "_blank" : undefined,
			items: items
				?.filter(({ hidden }) => !hidden)
				.map(({ title, longTitle, url, isExternal }) => ({
					href: isExternal ? url : `${base}/${url}`,
					label: title,
					title: title === longTitle ? "" : longTitle,
					target: isExternal ? "_blank" : undefined,
				})),
		}));
