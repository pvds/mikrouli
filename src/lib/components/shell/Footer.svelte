<script>
import Section from "./Section.svelte";
</script>

<div class="footer relative mt-75">
	<div
		class="absolute z-1 w-full min-w-5xl bottom-0 overflow-hidden pointer-events-none">
		<svg class="w-[inherit] h-96" xmlns="http://www.w3.org/2000/svg"
			 viewBox="0 0 1440 690" preserveAspectRatio="none">
			<path class="fill-primary-200" fill-opacity=".3"
				  d="M0 700V105c65-28 129-56 189-41s115 73 152 89 56-11 109-28 138-23 195-21 84 12 134 7 122-27 177-31 93 8 140 9 102-10 161-9 121 13 183 25v595H0Z"/>
			<path class="fill-primary-200" fill-opacity=".6"
				  d="M0 700V245c50 3 100 7 150-6s99-42 146-40 91 34 157 51 155 20 215 6 92-44 141-57 114-10 172 10 109 58 161 53 104-52 154-62 97 18 144 45v455H0Z"/>
			<path class="fill-primary-200" fill-opacity="1"
				  d="M0 700V385c54 14 107 29 162 26s111-22 162-20 98 25 155 27 123-19 184-25 118 1 159-7 65-31 122-21 145 54 199 64 74-12 118-25 111-16 179-19v315H0Z"/>
			<path class="hidden fill-primary-200"
				  d="M0 700V525c45-12 90-25 137-30s96-3 158 13 138 45 189 36 78-58 131-65 133 26 196 49 110 35 154 26 86-38 138-49 115-3 173 3l164 17v175H0Z"/>
		</svg>
	</div>

	<Section
		classes="relative px-6 py-10 z-2">
		<footer class="font-bold">
			<nav class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
				<a href="/contact">Get in contact</a>
				<a href="/about">About me</a>
				<a href="/">FAQ</a>
				<a href="/">Support</a>
				<a href="/blog">Blog</a>
			</nav>
		</footer>
	</Section>
</div>


