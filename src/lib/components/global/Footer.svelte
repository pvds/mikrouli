<script>
import Section from "$layout/Section.svelte";
import Image from "$ui/image/Image.svelte";
import { toNavItems } from "../../helpers/nav.js";

/**
 * @typedef {import('$types/contentful').NavigationEntry} NavigationEntry
 *
 * @typedef {Object} Props
 * @property {NavigationEntry} pages
 * @property {NavigationEntry} contact
 **/

/** @type {Props} */
let { pages, contact } = $props();

const navPages = toNavItems(pages.fields.items);
const navContact = toNavItems(contact.fields.items);
</script>

<footer class="footer relative mt-72 md:mt-80">
	<div
		class="absolute z-1 w-full min-w-6xl bottom-[calc(100%-8rem)] overflow-hidden pointer-events-none">
		<svg class="w-[inherit] h-96" xmlns="http://www.w3.org/2000/svg"
			 viewBox="0 0 1440 690" preserveAspectRatio="none">
			<path class="fill-primary-light" fill-opacity=".3"
				  d="M0 700V105c65-28 129-56 189-41s115 73 152 89 56-11 109-28 138-23 195-21 84 12 134 7 122-27 177-31 93 8 140 9 102-10 161-9 121 13 183 25v595H0Z"/>
			<path class="fill-primary-light" fill-opacity=".6"
				  d="M0 700V245c50 3 100 7 150-6s99-42 146-40 91 34 157 51 155 20 215 6 92-44 141-57 114-10 172 10 109 58 161 53 104-52 154-62 97 18 144 45v455H0Z"/>
			<path class="fill-primary-light" fill-opacity="1"
				  d="M0 700V385c54 14 107 29 162 26s111-22 162-20 98 25 155 27 123-19 184-25 118 1 159-7 65-31 122-21 145 54 199 64 74-12 118-25 111-16 179-19v315H0Z"/>
			<path class="hidden fill-primary-light"
				  d="M0 700V525c45-12 90-25 137-30s96-3 158 13 138 45 189 36 78-58 131-65 133 26 196 49 110 35 154 26 86-38 138-49 115-3 173 3l164 17v175H0Z"/>
		</svg>
	</div>

	<Section classes="z-2 bg-primary-light"
			 innerClasses="relative py-6 md:py-10 px-4 sm:px-6 md:px-8"
			 customSpacing="p-0">
		<div
			class="grid xs-mid:grid-cols-2 gap-x-4 gap-y-8 pb-4 mr-[max(10rem,30vw)] md:mr-[min(15rem,30vw)]">
			<nav aria-labelledby={pages.meta.id}>
				<strong id={pages.meta.id}
						class="sm:text-lg font-bold inline-block mb-2">{pages.fields.title}</strong>
				<ul class="grid min-[28em]:max-xs-mid:grid-cols-2 md-mid:grid-cols-2 gap-x-4 gap-y-2">
				{#each navPages as { href, label, title, target }}
					<li>
						<a {href} {title} {target}
						   class="font-semibold text-primary-darker hover:underline hover:text-accent-darker">{label}</a>
					</li>
				{/each}
				</ul>
			</nav>
			<nav aria-labelledby={contact.meta.id}>
				<strong id={contact.meta.id}
						class="sm:text-lg font-bold inline-block mb-2">{contact.fields.title}</strong>
				<ul
					class="grid min-[28em]:max-xs-mid:grid-cols-2 md-mid:grid-cols-2 gap-x-4 gap-y-2">
				{#each navContact as { href, label, title, target }}
					<li>
						<a {href} {title} {target}
						   class="font-semibold text-primary-darker hover:underline hover:text-accent-darker">{label}</a>
					</li>
				{/each}
				</ul>
			</nav>
		</div>
		<div class="absolute bottom-0 right-0">
		<Image image="eleni-papamikrouli"
			   sizes="(max-width: 48em) max(10rem,30vw), min(15rem,30vw)"
			   isLocal
			   alt="Portrait of Eleni Papamikrouli"
			   widthClass="w-[max(10rem,30vw)] md:w-[min(15rem,30vw)]"
			   classes="drop-shadow-[0_0_48px_rgba(24,68,70,.6)]" />
		</div>
	</Section>
</footer>
