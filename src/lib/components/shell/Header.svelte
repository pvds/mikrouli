<script>
import Branding from "./Branding.svelte";
import Nav from "./Nav.svelte";
import Section from "./Section.svelte";
</script>

<div class="header lg:sticky lg:-top-4 z-3">
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


