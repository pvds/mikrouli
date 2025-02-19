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

/** @type {Record<number,HTMLUListElement>} */
let menuPopovers = $state([]);

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
			"justify-around", "mobile")}</div>
		<div class="max-md:hidden relative bg-primary-darkest">
			{@render navMenu(navItemsBase, "gap-2", "desktop")}</div>
</nav>

{#snippet navMenu(/** @type NavigationItem[] */ navItems, /** @type string */ classes, /** @type
 string */ screen)}
<ul class="flex {classes} items-center justify-end">
{#each navItems as { href, label, title, menuTitle, target, items }, i}
	<li class="grow {href === base ? 'max-sm:hidden' : ''}">
		{#if items && screen === "desktop"}
		<button popovertarget="menu-popover-{screen}-{i}"
				class="[anchor-name:{screen}-{i}] nav-menu__link inline-flex w-full text-center
				px-1 md-mid:px-4 py-1 font-semibold transition-all {isCurrentPage(href) ? 'text-primary-lightest' :
				'text-primary-light hover:text-primary-lightest'}" type="button">{label}
			<svg class="inline w-[.8em] ml-1" xmlns="http://www.w3.org/2000/svg"
				 viewBox="0 0 512 512">
				<path d="M233 407c13 12 33 12 46 0l192-192a32 32 0 0 0-46-46L256 339 87 169a32 32 0 0 0-46 46l192 192z"/>
			</svg>
		</button>
		<ul bind:this={menuPopovers[i]} id="menu-popover-{screen}-{i}" popover="auto"
			class="[position-anchor:{screen}-{i}] [position-area:end_span-end] mt-1 open:flex open:flex-col gap-1 px-2 md-mid:px-0 py-2 rounded-md bg-primary-darker">
			<li>{@render NavLink(href, menuTitle || label, title, target, menuPopovers[i], true)}</li>
			{#each items as { href, label, title, target }}
			<li>{@render NavLink(href, label, title, target, menuPopovers[i], true)}</li>
			{/each}
		</ul>
		{:else}
		{@render NavLink(href, label, title, target, null, true, "text-center")}
		{/if}
	</li>
{/each}
	<li class="grow-0">
		<BookingDialog type="book" cta={bookingCta}/>
	</li>
</ul>
{/snippet}

{#snippet NavLink(
	/** @type string */href,
	/** @type string */label,
	/** @type {string|undefined} */ title,
	/** @type {string|undefined} */ target,
	/** @type {HTMLUListElement|null} */ menuPopover = null,
	/** @type {boolean} */ exactMatch = false,
	/** @type {string} */ classes = "",
)}
	<a {href} {title} {target} onclick={menuPopover ? () => menuPopover.hidePopover() : undefined}
		aria-current={isCurrentPage(href, true) ? "page" : undefined}
   		class="nav-menu__link inline-block w-full px-1 md-mid:px-4 py-1 font-semibold transition-all {classes}
		{isCurrentPage(href, exactMatch) ? 'text-primary-lightest' :
'text-primary-light hover:text-primary-lightest'}">{label}</a>
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
