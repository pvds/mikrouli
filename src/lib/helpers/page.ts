import { resolve } from "$app/paths";
import { page } from "$app/state";

export const isCurrentPage = (href: string, exactMatch = false): boolean => {
	const currentPath = page.url.pathname;
	return href === resolve("/")
		? href === currentPath
		: exactMatch
			? currentPath.endsWith(href)
			: currentPath.includes(href);
};
