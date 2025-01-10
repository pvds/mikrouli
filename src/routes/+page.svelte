<script>
import Hero from "$lib/components/layout/Hero.svelte";

let { data } = $props();
let { name } = data.global;
let { title, header, intro } = data.local;
</script>

<svelte:head>
	<title>{title} - {name}</title>
	<meta name="description" content="" />
</svelte:head>

<Hero title={header}>
	{@html intro}
</Hero>
