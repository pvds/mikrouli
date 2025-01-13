<script>
import Hero from "$lib/components/layout/Hero.svelte";

let { data } = $props();
let { header, intro } = data.local;
</script>

<Hero title={header}>
	{@html intro}
</Hero>
