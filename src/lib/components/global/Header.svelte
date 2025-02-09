<script>
import Section from "$layout/Section.svelte";
import { onDestroy, onMount } from "svelte";

/** @type {IntersectionObserver} */
let observer;
/** @type {HTMLDivElement} */
let sentinel;
let isCompact = $state(false);

/** @type {{children: import('svelte').Snippet}} */
let { children } = $props();

onMount(() => {
	observer = new IntersectionObserver(
		([entry]) => {
			isCompact = !entry.isIntersecting;
		},
		{ threshold: 0 },
	);

	if (sentinel) {
		observer.observe(sentinel);
	}
});

onDestroy(() => {
	if (observer && sentinel) {
		observer.unobserve(sentinel);
		observer.disconnect();
	}
});
</script>

<div class="header relative transition-all md:sticky {isCompact ? 'md:-top-4' : 'md:top-0'} z-3">
	<div
		class="header-wave absolute z-2 w-full min-w-6xl border-t-primary-darkest left-0 overflow-hidden transition-all pointer-events-none {isCompact ? 'border-t-54' : 'border-t-40'}">
		<svg class="w-[inherit] transition-all {isCompact ? 'h-8' : 'h-20'}"
			 xmlns="http://www.w3.org/2000/svg"
			 viewBox="0 0 1440 690" preserveAspectRatio="none">
			<path class="fill-primary-darkest drop-shadow-2xl"
				  d="M1440 0v438c-142 18-284 35-415 31-130-4-249-30-355-84S472 249 362 216c-109-33-236-18-362-3V0h1440Z"/>
		</svg>
	</div>
	<Section classes="z-3" customSpacing="px-4 py-6">
		<header class="flex items-center gap-4">
			{@render children()}
		</header>
	</Section>
</div>
<div bind:this={sentinel} class="sentinel relative -top-12"></div>
