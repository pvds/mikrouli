<script>
import Hero from "$layout/Hero.svelte";
import ServicesSection from "$layout/ServicesSection.svelte";

let { data } = $props();
let { header, intro } = data.page.fields;
let services = data.services;
</script>

<Hero title={header}>
	{@html intro}
</Hero>

<ServicesSection {services}/>
