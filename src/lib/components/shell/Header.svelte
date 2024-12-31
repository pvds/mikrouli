<script>
import Branding from "./Branding.svelte";
import Nav from "./Nav.svelte";
import Section from "./Section.svelte";
</script>

<div class="header relative">
	<div
		class="absolute z-2 w-full min-w-5xl border-t-24 border-t-primary-900 right-0 overflow-hidden pointer-events-none">
		<svg class="w-[inherit] h-50"
			 xmlns="http://www.w3.org/2000/svg"
			 viewBox="0 0 1440 690" preserveAspectRatio="none">
			<path class="hidden fill-primary-800"
				  d="M1440 0v569c-59 2-118 4-161 24s-70 58-129 34-148-111-215-122-110 54-150 91-78 45-126 35-106-40-158-39-96 32-158 37-140-16-200-30S42 577 0 569V0h1440Z"/>
			<path class="hidden fill-primary-800"
				  d="M1440 0v394c-45-6-89-12-142 8s-113 67-175 51-126-94-177-111-89 28-141 37-118-18-175-31-106-13-149 8-82 64-133 66-115-38-175-50-117 5-173 22V0h1440Z"/>
			<path class="fill-primary-900"
				  d="M1440 0v219c-59 3-117 5-170-1s-99-22-151-13-110 41-166 33-109-57-165-73-113 1-166 22-101 46-156 59-116 15-172 17-105 4-153-3-94-24-141-41V0h1440Z"/>
		</svg>
	</div>
	<Section classes="relative p-8 z-3">
		<header class="flex items-center gap-4">
			<Branding />
			<Nav/>
		</header>
	</Section>
</div>


