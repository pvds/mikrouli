<script>
import Hero from "$lib/components/shell/Hero.svelte";
</script>

<svelte:head>
	<title>Blog post X - Mikrouli</title>
	<meta name="description" content="" />
</svelte:head>

<Hero title="Blog post X">
	{@html "This is a blog post"}
</Hero>
