<script lang="ts">
import Hero from "#layout/Hero.svelte";
import { page } from "$app/state";
</script>

<Hero title={page.status.toString()}>
	{page?.error?.message}
</Hero>
