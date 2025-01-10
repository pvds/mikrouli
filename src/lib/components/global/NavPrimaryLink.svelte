<script>
import { base } from "$app/paths";

/**
 * @typedef {Object} Props
 * @property {string} href
 * @property {string | undefined} title
 * @property {string} currentPath
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let { href, title, currentPath, children } = $props();

let isCurrentPage = $derived(
	href === `${base}/` ? href === currentPath : currentPath.includes(href),
);
</script>

<li class="grow">
	<a {href} {title}
	class="inline-block w-full text-center px-3 py-1 font-semibold {isCurrentPage ?
	'text-primary-50' : 'text-primary-200 hover:text-primary-50'}"
	aria-current={isCurrentPage ? "page" : undefined}
	>
		{@render children?.()}
	</a>
</li>
