<script>
/**
 * @typedef {Object} Props
 * @property {string} href
 * @property {string} currentPath
 * @property {import('svelte').Snippet} [children]
 */

/** @type {Props} */
let { href, currentPath, children } = $props();

let isCurrentPage = $derived(currentPath.includes(href));
</script>

<li>
	<a {href}
	class="inline-flex px-3 py-1 rounded-3xl font-medium {isCurrentPage ?
	'text-accent-300' : 'hover:text-accent-400'}"
	aria-current={isCurrentPage ? "page" : undefined}
	>
		{@render children?.()}
	</a>
</li>
