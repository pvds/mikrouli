<script>
import Branding from "./Branding.svelte";
import Nav from "./Nav.svelte";
import Section from "./Section.svelte";
</script>

<div class="header lg:sticky lg:-top-4 z-3">
	<div
		class="absolute z-2 w-full min-w-5xl border-t-16 border-t-primary-900 right-0 overflow-hidden pointer-events-none">
		<svg class="w-[inherit] h-50"
			 xmlns="http://www.w3.org/2000/svg"
			 viewBox="0 0 1440 690" preserveAspectRatio="none">
			<path class="fill-primary-900"
				  d="M1440 0v219c-59 3-117 5-170-1s-99-22-151-13-110 41-166 33-109-57-165-73-113 1-166 22-101 46-156 59-116 15-172 17-105 4-153-3-94-24-141-41V0h1440Z"/>
		</svg>
	</div>
	<Section classes="relative px-8 py-6 z-3">
		<header class="flex items-center gap-4">
			<Branding />
			<Nav/>
		</header>
	</Section>
</div>


