<script>
import Hero from "$lib/components/shell/Hero.svelte";

let { data } = $props();
let { title, header, intro } = data.local;
let { name } = data.global;
</script>

<svelte:head>
	<title>{title} - {name}</title>
	<meta name="description" content="" />
</svelte:head>

<Hero title={header}>
	{@html intro}
</Hero>
