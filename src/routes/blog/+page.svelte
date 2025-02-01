<script>
import Hero from "$layout/Hero.svelte";
import Section from "$layout/Section.svelte";
import BlogArticle from "$ui/BlogArticle.svelte";

let { data } = $props();
let { header, intro } = data.page.fields;
let posts = data.posts;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

<!--TODO: Decide whether to add content sections-->
<!--{#each sections as section}-->
<!--	<ContentSection prose size="sm">-->
<!--		{@html section}-->
<!--	</ContentSection>-->
<!--{/each}-->

{#each posts as post, i}
	<Section wave={i % 2 === 1}>
		<BlogArticle post={post.fields} priority={i <= 3}/>
	</Section>
{/each}
