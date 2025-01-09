<script>
import { browser } from "$app/environment";
import { base } from "$app/paths";
import { page } from "$app/state";
import { onDestroy, onMount } from "svelte";
import NavPrimaryLink from "./NavPrimaryLink.svelte";

/** @type {{ menu: import('$lib/types/contentful').NavigationEntry }} */
let { menu } = $props();

/** @type {{ href: string, label: string, title: string }[]} */
const navItemsBase = menu.fields.items.map(({ slug, title, header }) => ({
	href: `${base}${slug}`,
	label: title,
	title: header,
}));
const navItemHome = { href: `${base}/`, label: "Home", title: "Mikrouli home page" };

const navItemsWithHome = [navItemHome, ...navItemsBase];

/** @type {HTMLUListElement} */
let bottomMenu;
/** @type {string} */
let breakpoint;

let smallScreen = $state(false);

const navItems = $derived(smallScreen ? navItemsWithHome : navItemsBase);

const handleResize = () => {
	smallScreen = window.matchMedia(`(max-width: ${breakpoint})`).matches;

	setTimeout(() => {
		document.documentElement.style.setProperty(
			"--global-spacing-bottom",
			smallScreen && bottomMenu
				? `${bottomMenu.getBoundingClientRect().height.toString()}px`
				: "0",
		);
	}, 0);
};

onMount(() => {
	breakpoint = getComputedStyle(document.documentElement).getPropertyValue("--breakpoint-md");
	handleResize(); // Initial check
	window.addEventListener("resize", handleResize);
});

onDestroy(() => {
	if (browser) window.removeEventListener("resize", handleResize);
});
</script>

<nav class="navigation-primary ml-auto"
	 aria-label="Main navigation">
	{#if smallScreen}
		{@render bottomNav()}
	{:else}
		{@render inlineNav()}
	{/if}
</nav>

{#snippet inlineNav()}
	<ul class="menu-inline flex relative bg-primary-900 gap-2">
		{@render navLinks()}
	</ul>
{/snippet}

{#snippet bottomNav()}
	<ul bind:this={bottomMenu}
		class="menu-bottom w-full flex justify-around fixed left-0 bottom-0 px-1 py-2 bg-primary-900">
		{@render navLinks()}
	</ul>
{/snippet}

{#snippet navLinks()}
	{#each navItems as { href, label, title }}
		<NavPrimaryLink {href} {title} currentPath={page.url.pathname}>
			{label}
		</NavPrimaryLink>
	{/each}
{/snippet}
