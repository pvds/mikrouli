<script lang="ts">
import type { Snippet } from "svelte";
import ContentSection from "$layout/ContentSection.svelte";
import type { SectionSize } from "$types/content";
import type { ImageField } from "$types/contentful";

type SectionLike = {
	id?: string | number;
	header?: string;
	title?: string;
	image?: ImageField;
	content?: string;
};

interface PageLike {
	sections?: SectionLike[];
	contentSections?: string[];
}

interface Props {
	page: PageLike | null | undefined;
	size?: SectionSize;
	prose?: boolean;
	proseClasses?: string;
	titleField?: "auto" | "header" | "title";
	contentFooter?: Snippet;
	firstSectionOnly?: boolean;
}

let {
	page,
	size = "lg",
	prose = true,
	proseClasses = "",
	titleField = "auto",
	contentFooter,
	firstSectionOnly = false,
}: Props = $props();

const sectionTitle = (section: SectionLike): string | undefined => {
	if (titleField === "header") return section.header;
	if (titleField === "title") return section.title;
	return section.header || section.title;
};

const items = $derived(
	page?.sections?.length
		? page.sections.map((section, index) => ({
				id: section.id ?? `section-${index}`,
				title: sectionTitle(section),
				content: section.content ?? "",
				image: section.image,
			}))
		: (page?.contentSections ?? []).map((content, index) => ({
				id: `content-section-${index}`,
				title: undefined,
				content,
				image: undefined,
			})),
);
</script>

{#if items.length}
	{#each items as section, i (section.id)}
		<ContentSection
			prose={prose}
			size={size}
			index={i}
			title={section.title}
			image={section.image}
			contentFooter={firstSectionOnly && i === 0 ? contentFooter : undefined}
			proseClasses={proseClasses}
		>
			{@html section.content}
		</ContentSection>
	{/each}
{/if}
