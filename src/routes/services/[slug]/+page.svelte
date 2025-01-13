<script>
import Hero from "$lib/components/layout/Hero.svelte";

let { data } = $props();
let { title, intro } = data.local;
</script>

<Hero {title}>
	{@html intro}
</Hero>
