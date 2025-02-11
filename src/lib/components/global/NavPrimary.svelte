<script>
import { base } from "$app/paths";
import { isCurrentPage } from "$lib/helpers/page";
import BookingDialog from "$ui/BookingDialog.svelte";
import WaveCss from "$visuals/WaveCss.svelte";
import { toNavItems } from "../../helpers/nav.js";

/**
 * @typedef {import('$types/contentful').NavigationEntry} NavigationEntry
 * @typedef {import('$types/content').NavigationItem} NavigationItem
 */

/** @type {{ menu: NavigationEntry }} */
let { menu } = $props();

const navItemsBase = toNavItems(menu.fields.items);
/** @type NavigationItem */
const navItemHome = { href: base, label: "Home", title: "Mikrouli home page" };
const navItemsWithHome = [navItemHome, ...navItemsBase];
const bookingCta = {
	text: "Book a Session",
	textShort: "Book",
	textLong: "Book a Session with me",
	classes:
		"px-3 md-mid:px-4 py-2 inset-shadow-xs inset-shadow-accent-darkest hover:inset-shadow-black",
};
</script>
<nav class="nav-primary ml-auto"
	 aria-label="Main navigation">
		<div class="md:hidden w-full fixed left-0 bottom-0 bg-primary-darkest px-1 py-2">
			<WaveCss height={10} color="bg-primary-darkest"/> {@render navMenu(navItemsWithHome,
			"justify-around")}</div>
		<div class="max-md:hidden relative bg-primary-darkest">
			{@render navMenu(navItemsBase, "gap-2")}</div>
</nav>

{#snippet navMenu(/** @type NavigationItem[] */ navItems, /** @type string */ classes)}
	<ul class="flex {classes} items-center justify-end">
	{#each navItems as { href, label, title, target }}
		<li class="grow">
			<a {href} {title} {target} aria-current={isCurrentPage(href) ? "page" : undefined}
			   class="nav-menu__link inline-block w-full text-center px-1 md-mid:px-4 py-1 font-semibold transition-all
			   {href === base && 'max-sm:hidden'}
				{isCurrentPage(href) ? 'text-primary-lightest' :
				'text-primary-light hover:text-primary-lightest'}">{label}</a>
		</li>
	{/each}
		<li class="grow">
			<BookingDialog type="book" cta={bookingCta}/>
		</li>
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
