<!-- NavLink.svelte -->
<script>
/** @type {string} */
export let href;
/** @type {string} */
export let currentPath;

$: isCurrentPage = currentPath === href;
</script>

<li>
	<a {href}
	class="inline-flex px-3 py-1 rounded-lg font-medium hover:text-brand-300"
	aria-current={isCurrentPage ? "page" : undefined}
	>
		<slot />
	</a>
</li>
