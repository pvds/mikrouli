<script>
import Branding from "$lib/components/global/Branding.svelte";
import Footer from "$lib/components/global/Footer.svelte";
import Header from "$lib/components/global/Header.svelte";
import "../app.css";
import NavPrimary from "$lib/components/global/NavPrimary.svelte";
import Seo from "$lib/components/util/seo/Seo.svelte";

let { children, data } = $props();
let { nav } = data.local;
</script>

<Seo/>

<div class="relative overflow-clip flex flex-col app min-h-svh bg-primary-50 text-primary-800">
	<Header>
		<Branding />
		<NavPrimary menu={nav.primary}/>
	</Header>

	<main class="grow">
		{@render children()}
	</main>

	<Footer />
</div>
