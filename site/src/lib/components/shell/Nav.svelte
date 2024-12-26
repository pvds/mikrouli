<!-- Nav.svelte -->
<script>
import { page } from "$app/state";
import NavLink from "./NavLink.svelte";

/** @type {{ href: string, label: string }[]} */
const navItems = [
	{ href: "/services", label: "Services" },
	{ href: "/blog", label: "Blog" },
	{ href: "/contact", label: "Contact" },
	{ href: "/about", label: "About" },
];
</script>

<nav aria-label="Main navigation">
	<ul class="flex gap-2">
		{#each navItems as { href, label }}
			<NavLink {href} currentPath={page.url.pathname}>
				{label}
			</NavLink>
		{/each}
	</ul>
</nav>
