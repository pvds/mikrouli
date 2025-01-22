<script>
import { page } from "$app/state";
import Hero from "$layout/Hero.svelte";
</script>

<Hero title={page.status.toString()}>
	{page?.error?.message}
</Hero>
