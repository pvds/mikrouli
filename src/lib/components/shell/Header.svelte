<script>
import { onDestroy, onMount } from "svelte";
import Branding from "./Branding.svelte";
import Nav from "./Nav.svelte";
import Section from "./Section.svelte";

/** @type {IntersectionObserver} */
let observer;
/** @type {HTMLDivElement} */
let sentinel;
let isCompact = false;

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

<div
	class="header transition-all lg:sticky {isCompact ? 'lg:-top-4' : 'lg:top-0'} z-3">
	<div
		class="absolute z-2 w-full min-w-5xl border-t-40 border-t-primary-900 left-0 overflow-hidden pointer-events-none">
		<svg class="w-[inherit] h-20"
			 xmlns="http://www.w3.org/2000/svg"
			 viewBox="0 0 1440 690" preserveAspectRatio="none">
			<path class="fill-primary-900"
				  d="M1440 0v438c-142 18-284 35-415 31-130-4-249-30-355-84S472 249 362 216c-109-33-236-18-362-3V0h1440Z"/>
		</svg>
	</div>
	<Section classes="relative px-4 py-6 z-3">
		<header class="flex items-center gap-4">
			<Branding />
			<Nav/>
		</header>
	</Section>
</div>
<div bind:this={sentinel} class="sentinel relative -top-12"></div>
