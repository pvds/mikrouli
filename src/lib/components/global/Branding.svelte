<script>
import { base } from "$app/paths";
import { ORG_NAME, ORG_NAME_SUFFIX } from "$config";
import Logo from "$visuals/Logo.svelte";
</script>

<section role="banner">
	<a class="flex gap-3 items-center" href="{base}/"
	   aria-label="Go to Mikrouli homepage">
		<Logo classes="relative bottom-[3px] size-11 fill-primary-light"/>
		<div class="relative top-[-6px] flex items-baseline">
			<strong class="font-medium text-2xl text-primary-lightest">{ORG_NAME}</strong>
			<p class="ml-2 text-primary-light text-nowrap">{ORG_NAME_SUFFIX}</p>
		</div>
	</a>
</section>
