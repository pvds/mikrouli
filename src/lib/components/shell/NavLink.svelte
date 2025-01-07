<script>
import { base } from "$app/paths";

/**
 * @typedef {Object} Props
 * @property {string} href
 * @property {string} currentPath
 * @property {import('svelte').Snippet} [children]
 * @property {() => void} clicked
 */

/** @type {Props} */
let { href, currentPath, children, clicked } = $props();

let isCurrentPage = $derived(
	href === `${base}/` ? href === currentPath : currentPath.includes(href),
);
</script>

<li class="grow">
	<a {href} onclick="{() => clicked()}"
	class="inline-block w-full text-center px-3 py-1 font-semibold {isCurrentPage ?
	'text-primary-50' : 'text-primary-200 hover:text-primary-50'}"
	aria-current={isCurrentPage ? "page" : undefined}
	>
		{@render children?.()}
	</a>
</li>
