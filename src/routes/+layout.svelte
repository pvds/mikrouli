<script>
import { onNavigate } from "$app/navigation";
import Branding from "$lib/components/global/Branding.svelte";
import Footer from "$lib/components/global/Footer.svelte";
import Header from "$lib/components/global/Header.svelte";
import "../app.css";
import NavPrimary from "$lib/components/global/NavPrimary.svelte";
import Skip from "$lib/components/global/Skip.svelte";
import Seo from "$lib/components/util/seo/Seo.svelte";

let { children, data } = $props();
let { nav } = data.local;

onNavigate((navigation) => {
	if (!document.startViewTransition) return;

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
