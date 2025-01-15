<script>
import { base } from "$app/paths";
import { isCurrentPage } from "$lib/helpers/page";

/** @typedef {{ href: string, label: string, title: string | undefined }} NavItem */

/** @type {{ menu: import('$lib/types/contentful').NavigationEntry }} */
let { menu } = $props();

/** @type NavItem[] */
const navItemsBase = menu.fields.items.map(({ slug, title, header }) => ({
	href: `${base}/${slug}`,
	label: title,
	title: header,
}));
/** @type NavItem */
const navItemHome = { href: `${base}/`, label: "Home", title: "Mikrouli home page" };
const navItemsWithHome = [navItemHome, ...navItemsBase];
</script>
<nav class="nav-primary ml-auto"
	 aria-label="Main navigation">
		<ul class="md:hidden nav-menu--bottom w-full flex justify-around fixed
		left-0 bottom-0 bg-primary-900 px-1 py-2">{@render navLinks(navItemsWithHome)}</ul>
		<ul
			class="max-md:hidden nav-menu--inline flex relative gap-2 bg-primary-900">{@render
			navLinks(navItemsBase)}</ul>
</nav>

{#snippet navLinks(/** @type NavItem[] */ navItems)}
	{#each navItems as { href, label, title }}
		<li class="grow">
			<a {href} {title} aria-current={isCurrentPage(href) ? "page" : undefined}
			   class="nav-menu__link inline-block w-full text-center px-3 py-1 font-semibold
				{isCurrentPage(href) ? 'text-primary-50' :
				'text-primary-200 hover:text-primary-50'}">{label}</a>
		</li>
	{/each}
{/snippet}

<style>
	:root {
		--nav-primary-bottom: 48px;
		--global-spacing-bottom: var(--nav-primary-bottom);
		@media (min-width: var(--breakpoint-md)) {
			--global-spacing-bottom: 0;
		}
	}
</style>
