import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Button } from '../components/button/button';
import { Tile } from '../components/tile/tile';

// import Image from '../media/tree-mikrouli.webp?jsx';

export default component$(() => {
  return (
    <div class="grid gap-4">
      <section id="intro" class="mb-6">
        {/* TODO: move to intro-teaser*/}
        <Tile hasBg={false} hasPadding={false}>
          <p class="leading-7 max-w-2xl">
            At Mikrouli, we believe in the power of connection to heal and grow.
            Our approach to systemic psychotherapy nurtures your mental health
            through understanding, compassion, and tailored support, fostering
            lasting change in your life and relationships.
          </p>
        </Tile>
      </section>
      {/* TODO: move to services-teaser*/}
      <section id="services" class="mb-6">
        <h2 class="text-2xl font-bold text-brand-800">Our Services</h2>
        <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Tile>
            <article class="grid grid-rows-article gap-2 h-full">
              <h3 class="text-xl font-semi-bold text-brand-800">
                Individual therapy
              </h3>
              <p>
                Dive deep into self-discovery and healing with our personalized
                therapeutic sessions, designed just for you.
              </p>
              <Button>Inquire</Button>
            </article>
          </Tile>
          <Tile>
            <article class="grid grid-rows-article gap-2 h-full">
              <h3 class="text-xl font-semi-bold text-brand-800">
                Couples therapy
              </h3>
              <p>
                Rekindle connection and understanding in your relationship with
                our compassionate, skilled couples therapy.
              </p>
              <Button>Inquire</Button>
            </article>
          </Tile>
          <Tile>
            <article class="grid grid-rows-article gap-2 h-full">
              <h3 class="text-xl font-semi-bold text-brand-800">
                Family therapy
              </h3>
              <p>
                Strengthen your family bonds with our therapy sessions, creating
                a more harmonious and understanding home environment.
              </p>
              <Button>Inquire</Button>
            </article>
          </Tile>
        </div>
      </section>
      {/* TODO: move to about-teaser*/}
      <section id="about" class="mb-6 min-h-[20vmax]">
        <h2 class="mb-6 text-2xl font-bold text-brand-800">About</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <Tile>
            <article class="grid grid-rows-article gap-2 h-full">
              <h3 class="text-xl font-semi-bold text-brand-800">Our Mission</h3>
              <p>
                At Mikrouli, our mission is to transform patterns and enrich
                lives through systemic psychotherapy, fostering connection and
                growth in individuals, couples, and families.
              </p>
              <Button>Learn More</Button>
            </article>
          </Tile>
          <Tile>
            <article class="grid grid-rows-article gap-2 h-full">
              <h3 class="text-xl font-semi-bold text-brand-800">Our System</h3>
              <p>
                Mikrouli's systemic psychotherapy approach is rooted in
                compassion, understanding, and connection, guiding you through
                your mental health journey with tailored support.
              </p>
              <Button>Meet Us</Button>
            </article>
          </Tile>
        </div>
      </section>
      {/* TODO: move to contact-teaser*/}
      <div
        id="contact"
        class="h-[15rem] mb-6 grid place-items-center gap-4 sm:grid-cols-2"
      >
        <Tile hasBg={false}>
          <Button>Get in contact</Button>
        </Tile>
        <Tile hasBg={false}>
          <Button>Make an appointment</Button>
        </Tile>
      </div>
      {/* TODO: move to blog-teaser*/}
      <section id="blog" class="mb-6">
        <h2 class="mb-6 text-2xl font-bold text-brand-800">Blog</h2>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Tile>
            <article class="grid grid-rows-article gap-2 h-full">
              <h3 class="text-xl font-semi-bold text-brand-800">
                The Power of Systemic Therapy
              </h3>
              <p>
                Explore how systemic therapy can unlock profound insights into
                your relationships and personal growth journey.
              </p>
              <Button>Explore</Button>
            </article>
          </Tile>
          <Tile>
            <article class="grid grid-rows-article gap-2 h-full">
              <h3 class="text-xl font-semi-bold text-brand-800">
                Navigating Relationship Dynamics
              </h3>
              <p>
                Uncover strategies to improve communication, understanding, and
                intimacy in your relationships with systemic therapy insights.
              </p>
              <Button>Navigate</Button>
            </article>
          </Tile>
          <Tile>
            <article class="grid grid-rows-article gap-2 h-full">
              <h3 class="text-xl font-semi-bold text-brand-800">
                Empathy in Therapy
              </h3>
              <p>
                Discover how empathy can transform your therapy experience,
                fostering deeper connection and understanding
              </p>
              <Button>Discover</Button>
            </article>
          </Tile>
          <Tile>
            <article class="grid grid-rows-article gap-2 h-full">
              <h3 class="text-xl font-semi-bold text-brand-800">
                Building Resilience through Self-Discovery
              </h3>
              <p>
                Learn how systemic psychotherapy can help you uncover your
                strengths and resilience, guiding you through life's challenges
              </p>
              <Button>Learn</Button>
            </article>
          </Tile>
        </div>
      </section>
      {/*<div class="relative">*/}
      {/*  <Image class="w-full h-full" />*/}
      {/*  <div class="absolute top-0 w-full h-full bg-white opacity-90"></div>*/}
      {/*</div>*/}
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Mikrouli',
  meta: [
    {
      name: 'description',
      content: 'Mikrouli description',
    },
  ],
};
