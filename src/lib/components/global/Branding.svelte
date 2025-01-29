<script>
import { base } from "$app/paths";
import Logo from "$visuals/Logo.svelte";
</script>

<section role="banner">
	<a class="flex gap-3 items-center" href={base}>
		<Logo classes="relative top-[1px] size-10 fill-primary-200"/>
		<h1 class="font-medium text-2xl text-primary-50">Mikrouli</h1>
	</a>
</section>
