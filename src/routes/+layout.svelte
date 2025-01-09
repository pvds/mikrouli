<script>
import Branding from "$lib/components/shell/Branding.svelte";
import Footer from "$lib/components/shell/Footer.svelte";
import Header from "$lib/components/shell/Header.svelte";
import "../app.css";
import NavPrimary from "$lib/components/shell/NavPrimary.svelte";

let { children, data } = $props();
let { nav } = data.local;
</script>

<div class="relative overflow-clip flex flex-col app min-h-dvh bg-primary-50 text-primary-800">
	<Header>
		<Branding />
		<NavPrimary menu={nav.primary}/>
	</Header>

	<main class="grow">
		{@render children()}
	</main>

	<Footer />
</div>
