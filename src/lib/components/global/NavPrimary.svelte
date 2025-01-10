<script>
import { base } from "$app/paths";
import { remToPx } from "$lib/helpers/conversion";
import { isCurrentPage } from "$lib/helpers/page";
import { onMount } from "svelte";

/** @type {{ menu: import('$lib/types/contentful').NavigationEntry }} */
let { menu } = $props();

/** @type {{ href: string, label: string, title: string | undefined }[]} */
const navItemsBase = menu.fields.items.map(({ slug, title, header }) => ({
	href: `${base}/${slug}`,
	label: title,
	title: header,
}));
const navItemHome = { href: `${base}/`, label: "Home", title: "Mikrouli home page" };
const navItemsWithHome = [navItemHome, ...navItemsBase];

// DOM references
/** @type {HTMLUListElement|undefined} */
let bottomMenu = $state();

// Reactive variables
let breakpoint = $state(0);
let viewportWidth = $state(0);
let smallScreen = $derived(viewportWidth <= breakpoint);
const navItems = $derived(smallScreen ? navItemsWithHome : navItemsBase);

const updateGlobalSpacingBottom = () => {
	const height = bottomMenu?.getBoundingClientRect().height || 0;
	document.documentElement.style.setProperty(
		"--global-spacing-bottom",
		smallScreen ? `${height}px` : "0",
	);
};

$effect(() => {
	updateGlobalSpacingBottom();
});

onMount(() => {
	breakpoint = remToPx(
		getComputedStyle(document.documentElement).getPropertyValue("--breakpoint-md"),
	);
});
</script>
<svelte:window bind:innerWidth={viewportWidth}/>

<nav class="nav-primary ml-auto"
	 aria-label="Main navigation">
	{#if smallScreen}
		<ul class="nav-menu--inline flex relative gap-2">{@render navLinks()}</ul>
	{:else}
		<ul bind:this={bottomMenu} class="nav-menu--bottom w-full flex justify-around fixed left-0 bottom-0 px-1 py-2">{@render navLinks()}</ul>
	{/if}
</nav>

{#snippet navLinks()}
	{#each navItems as { href, label, title }}
		<li class="grow">
			<a {href} {title} aria-current={isCurrentPage(href) ? "page" : undefined}
			   class="nav-menu__link inline-block w-full text-center px-3 py-1 font-semibold {isCurrentPage(href) ? 'text-primary-50' :
			   'text-primary-200 hover:text-primary-50'}">{label}</a>
		</li>
	{/each}
{/snippet}
