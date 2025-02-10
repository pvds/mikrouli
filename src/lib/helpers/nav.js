import { base } from "$app/paths";

/**
 * @typedef {import('$types/contentful').NavigationFieldItems} NavigationFieldItems
 * @typedef {import('$types/content').NavigationItem} NavigationItem
 */

/**
 * Converts Contentful navigation items to an array of NavItem objects
 * @param {NavigationFieldItems[]} items
 * @returns {NavigationItem[]}
 */
export const toNavItems = (items) => {
	return items.map(({ title, longTitle, url, isExternal }) => ({
		href: isExternal ? url : `${base}/${url}`,
		label: title,
		title: title === longTitle ? "" : longTitle,
		target: isExternal ? "_blank" : undefined,
	}));
};
