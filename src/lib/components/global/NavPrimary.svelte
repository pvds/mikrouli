<script>
import { base } from "$app/paths";
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

/** @type {HTMLUListElement} */
let bottomMenu;
/** @type {string} */
let breakpoint;

// Reactive variables
let smallScreen = $state(false);
const navItems = $derived(smallScreen ? navItemsWithHome : navItemsBase);

const handleResize = () => {
	smallScreen = window.matchMedia(`(max-width: ${breakpoint})`).matches;
};

const updateGlobalSpacingBottom = () => {
	const height = bottomMenu?.getBoundingClientRect().height || 0;
	document.documentElement.style.setProperty(
		"--global-spacing-bottom",
		smallScreen ? `${height}px` : "0",
	);
};

$effect(() => {
	// $inspect.trace("updateGlobalSpacingBottom");
	updateGlobalSpacingBottom();
});

onMount(() => {
	breakpoint = getComputedStyle(document.documentElement).getPropertyValue("--breakpoint-md");
	handleResize(); // Initial check
});
</script>
<svelte:window onresize={handleResize}/>

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
		<li class="grow">
			<a {href} {title}
			   class="inline-block w-full text-center px-3 py-1 font-semibold {isCurrentPage(href) ?
	'text-primary-50' : 'text-primary-200 hover:text-primary-50'}"
			   aria-current={isCurrentPage(href) ? "page" : undefined}
			>
				{label}
			</a>
		</li>
	{/each}
{/snippet}
