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
	class="inline-flex px-3 py-1 rounded-lg text-white bg-green-800 hover:bg-green-700"
	aria-current={isCurrentPage ? "page" : undefined}
	>
		<slot />
	</a>
</li>
