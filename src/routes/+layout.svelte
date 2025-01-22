<script>
import { onNavigate } from "$app/navigation";
import Branding from "$global/Branding.svelte";
import Footer from "$global/Footer.svelte";
import Header from "$global/Header.svelte";
import NavPrimary from "$global/NavPrimary.svelte";
import Skip from "$global/Skip.svelte";
import Seo from "$lib/components/util/seo/Seo.svelte";
import "../app.css";

let { children, data } = $props();
let { nav } = data.local;

const disableViewTransitions = true;

onNavigate((navigation) => {
	if (!document.startViewTransition || disableViewTransitions) return;

	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
});
</script>

<Seo/>

<div class="relative overflow-clip flex flex-col app min-h-svh bg-primary-50 text-primary-800">
	<Skip />

	<Header>
		<Branding />
		<NavPrimary menu={nav.primary}/>
	</Header>

	<main id="main-content" class="grow" tabindex="-1">
		{@render children()}
	</main>

	<Footer />
</div>
