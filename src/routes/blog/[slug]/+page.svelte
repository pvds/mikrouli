<script>
import Hero from "$lib/components/shell/Hero.svelte";

let { data } = $props();
let { title, intro } = data.local;
let { name } = data.global;
</script>

<svelte:head>
	<title>{title} - {name}</title>
	<meta name="description" content="" />
</svelte:head>

<Hero title={title}>
	{@html intro}
</Hero>
