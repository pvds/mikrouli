<script>
import Hero from "$layout/Hero.svelte";
import ServiceSection from "$layout/ServiceSection.svelte";

let { data } = $props();
let { header, intro } = data.page.fields;
let services = data.services;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

<ServiceSection {services}/>
