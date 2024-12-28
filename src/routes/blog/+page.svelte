<script>
import Hero from "$lib/components/shell/Hero.svelte";
import Section from "$lib/components/shell/Section.svelte";

/** @type {{data: import('$lib/types/contentful').ContentfulData}} */
let { data } = $props();

const page = data.pages.find((page) => page.fields.slug === "blog");
</script>

<svelte:head>
	<title>Blog - Mikrouli</title>
	<meta name="description" content="" />
</svelte:head>

{#if page}
	<Hero title={page.fields.longTitle}>
		<p>
			{page.fields.intro}
		</p>
	</Hero>

    <!-- TODO: remove this demo content -->

    <Section classes="p-8">
        <h2 class="mb-4 text-2xl font-bold">Why Therapy Isn’t About Fixing You</h2>
        <div class="prose-base">
            <p class="italic">
                Many people think therapy is about diagnosing problems. Systemic
                therapy offers a different perspective—it’s about working with the systems
                around you.
            </p>
            <h3 class="text-2xl">Moving Beyond Labels</h3>
            <p>
                Systemic therapy takes a different approach by stepping away from the idea of
                diagnosing individuals. Instead, it focuses on the systems we live in—families,
                workplaces, and communities
            </p>
            <h3 class="text-2xl">Exploring Possibilities</h3>
            <p>
                Rather than seeing yourself as flawed, systemic therapy helps you explore how
                the patterns in your life shape your experiences. It’s a process of curiosity
                and discovery, rather than one of fault-finding.
            </p>
        </div>
    </Section>

    <Section classes="p-8 bg-brand-200">
        <h2 class="mb-4 text-2xl font-bold">Adapting to Life Abroad</h2>
        <div class="prose-base">
            <p class="italic">
                The expat experience is full of transitions and challenges. Here are
                some systemic tools to help you find stability and connection in a new culture.
            </p>
            <h3 class="text-2xl">The Unique Challenges of Expat Lifes</h3>
            <p>
                From language barriers to cultural differences, living abroad comes with its own
                set of struggles. These challenges often impact not just individuals but their
                families and relationships.
            </p>
            <h3 class="text-2xl">Finding Support and Connection</h3>
            <p>
                Systemic therapy helps you understand how these challenges influence your life
                and relationships. Together, we explore strategies to create stability and a
                sense of belonging, no matter where you are.
            </p>
        </div>
    </Section>

    <Section classes="p-8">
        <h2 class="mb-4 text-2xl font-bold">Strengthening Communication in Relationships</h2>
        <div class="prose-base">
            <p class="italic">
                Miscommunication is one of the most common sources of conflict in relationships.
                Systemic therapy can help you shift how you talk and listen.
            </p>
            <h3 class="text-2xl">Why Communication Matters</h3>
            <p>
                At its core, communication is how we connect. But when communication breaks down,
                misunderstandings and conflict arise, creating distance in relationships.
            </p>
            <h3 class="text-2xl">Tools for Effective Communication</h3>
            <p>
                Systemic therapy provides practical tools to help you listen more openly, express
                yourself clearly, and rebuild trust. Small shifts in how you communicate can lead
                to profound changes in your relationships.
            </p>
        </div>
    </Section>
    <Section classes="p-8 bg-accent-200">
        <h2 class="mb-4 text-2xl font-bold">Understanding the Systems That Shape Us</h2>
        <div class="prose-base">
            <p class="italic">
                From families to workplaces, the systems we live in affect us deeply. Explore how
                systemic therapy helps you navigate these dynamics.
            </p>
            <h3 class="text-2xl">What Are Systems?</h3>
            <p>
                Systems are the groups we belong to, from families to workplaces. These systems
                shape our behaviors, beliefs, and interactions, often in ways we don’t realize.
            </p>
            <h3 class="text-2xl">Making the Invisible Visible</h3>
            <p>
                Systemic therapy helps you see these dynamics and identify where patterns might
                be holding you back. By addressing the system as a whole, we can find ways to
                create movement and change.
            </p>
        </div>
    </Section>
{/if}
