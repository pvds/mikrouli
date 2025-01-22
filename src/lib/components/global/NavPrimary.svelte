<script>
import { base } from "$app/paths";
import { isCurrentPage } from "$lib/helpers/page";
import WaveCss from "$visuals/WaveCss.svelte";

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
		<div class="md:hidden w-full fixed left-0 bottom-0 bg-primary-900 px-1 py-2">
			<WaveCss height={10}/> {@render navMenu(navItemsWithHome, "justify-around")}</div>
		<div class="max-md:hidden relative bg-primary-900">
			{@render navMenu(navItemsBase, "gap-2")}</div>
</nav>

{#snippet navMenu(/** @type NavItem[] */ navItems, /** @type string */ classes)}
	<ul class="flex {classes}">
	{#each navItems as { href, label, title }}
		<li class="grow">
			<a {href} {title} aria-current={isCurrentPage(href) ? "page" : undefined}
			   class="nav-menu__link inline-block w-full text-center px-3 py-1 font-semibold
				{isCurrentPage(href) ? 'text-primary-50' :
				'text-primary-200 hover:text-primary-50'}">{label}</a>
		</li>
	{/each}
	</ul>
{/snippet}

<style>
	:root {
		--nav-primary-top: 0px;
		--nav-primary-bottom: 48px;
		--global-spacing-top: var(--nav-primary-top);
		--global-spacing-bottom: var(--nav-primary-bottom);
	}

	@media (min-width: 768px) {
		:root {
			--nav-primary-top: 72px;
			--nav-primary-bottom: 0px;
		}
	}
</style>
