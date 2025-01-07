<script>
import Hero from "$lib/components/shell/Hero.svelte";

let { data } = $props();
let { title, longTitle, intro } = data.local;
</script>

<svelte:head>
	<title>{title} - Mikrouli</title>
	<meta name="description" content="" />
</svelte:head>

<Hero title={longTitle}>
	{@html intro}
</Hero>
