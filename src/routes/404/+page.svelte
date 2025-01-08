<script>
import { base } from "$app/paths";
import Hero from "$lib/components/shell/Hero.svelte";

let { data } = $props();
let { longTitle, intro } = data.local;
let { name } = data.global;
</script>

<svelte:head>
	<title>{longTitle} - {name}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Hero title={longTitle}>
	{@html intro}
</Hero>
