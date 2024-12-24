<script>
import { page } from "$app/state";
</script>

<header class="w-full px-4 py-2 bg-cyan-950 text-white flex">
	<nav>
		<ul class="flex gap-2">
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">About</a>
			</li>
		</ul>
	</nav>
</header>
 
