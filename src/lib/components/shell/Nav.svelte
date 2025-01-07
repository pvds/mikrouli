<script>
import { browser } from "$app/environment";
import { page } from "$app/state";
import { onDestroy, onMount } from "svelte";
import NavLink from "./NavLink.svelte";

/** @type {{ href: string, label: string }[]} */
const navItems = [
	{ href: "services", label: "Services" },
	{ href: "blog", label: "Blog" },
	{ href: "contact", label: "Contact" },
	{ href: "about", label: "About" },
];
/** @type {HTMLUListElement} */
let popoverMenu;
/** @type {HTMLUListElement} */
let bottomMenu;
/** @type {string} */
let breakpoint;

let smallScreen = false;
let fixedNav = true;

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
	breakpoint = getComputedStyle(document.documentElement).getPropertyValue("--breakpoint-sm");
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
		{#if fixedNav}
			{@render bottomNav()}
		{:else}
			{@render popoverNav()}
		{/if}
	{:else}
		{@render inlineNav()}
	{/if}
</nav>

{#snippet inlineNav()}
	<ul class="menu-inline flex relative bg-primary-900 gap-2">
		{@render navLinks()}
	</ul>
{/snippet}

{#snippet popoverNav()}
	<button popovertarget="menu-popover"
			class="menu-popover-toggle cursor-pointer text-primary-200 font-semibold px-3 py-1"
			type="button">Menu
	</button>
	<ul bind:this={popoverMenu} id="menu-popover" popover popovertargetaction="toggle"
		class="menu-popover absolute open:flex open:flex-col gap-1 px-1 py-2 rounded-md bg-primary-800">
		{@render navLinks()}
	</ul>
{/snippet}

{#snippet bottomNav()}
	<ul bind:this={bottomMenu}
		class="menu-bottom w-full flex justify-around fixed left-0 bottom-0 px-1 py-2 bg-primary-900 gap-2">
		{@render navLinks()}
	</ul>
{/snippet}

{#snippet navLinks()}
	{#each navItems as { href, label }}
		<NavLink {href} currentPath={page.url.pathname} clicked="{() => popoverMenu?.hidePopover()}">
			{label}
		</NavLink>
	{/each}
{/snippet}

<style>
	.menu-popover-toggle {
		anchor-name: --toggle;
	}

	.menu-popover {
		position-anchor: --toggle;
		position-area: end span-start;
	}
</style>
