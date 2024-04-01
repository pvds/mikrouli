import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Button } from '../components/button/button';
import { Tile } from '../components/tile/tile';

// import Image from '../media/tree-mikrouli.webp?jsx';

export default component$(() => {
  return (
    <div class="grid gap-4">
      <div id="intro">
        <Tile hasBg={false} hasPadding={false}>
          <div class="grid md:grid-cols-2 my-2">
            <p class="leading-7">
              At Mikrouli, we believe in the power of connection to heal and
              grow. Our approach to systemic psychotherapy nurtures your mental
              health through understanding, compassion, and tailored support,
              fostering lasting change in your life and relationships.
            </p>
          </div>
        </Tile>
      </div>
      <div
        id="services"
        class="h-[40vmax] md:h-[20vmax] grid gap-4 sm:grid-cols-2 md:grid-cols-3"
      >
        <Tile>
          <p class="text-lg text-brand-800 font-semibold">
            Dive deep into self-discovery and healing with our personalized
            therapeutic sessions, designed just for you.
          </p>
          <Button>Individual therapy</Button>
        </Tile>
        <Tile>
          <p class="text-lg text-brand-800 font-semibold">
            Rekindle connection and understanding in your relationship with our
            compassionate, skilled couples therapy.
          </p>
          <Button>Couples therapy</Button>
        </Tile>
        <Tile>
          <p class="text-lg text-brand-800 font-semibold">
            Strengthen your family bonds with our therapy sessions, creating a
            more harmonious and understanding home environment.
          </p>
          <Button>Family therapy</Button>
        </Tile>
      </div>
      <div id="about" class="min-h-[20vmax] grid">
        {/*<div class="relative">*/}
        {/*  <Image class="w-full h-full" />*/}
        {/*  <div class="absolute top-0 w-full h-full bg-white opacity-90"></div>*/}
        {/*</div>*/}
      </div>
      <div
        id="blog"
        class="h-[40vmax] md:h-[20vmax] grid gap-4 xs:grid-cols-2 md:grid-cols-4"
      >
        <Tile>
          <p class="text-lg text-brand-800 font-semibold">
            Explore how systemic therapy can unlock profound insights into your
            relationships and personal growth journey.
          </p>
          <Button>The Power of Systemic Therapy</Button>
        </Tile>
        <Tile>
          <p class="text-lg text-brand-800 font-semibold">
            Uncover strategies to improve communication, understanding, and
            intimacy in your relationships with systemic therapy insights.
          </p>
          <Button>Navigating Relationship Dynamics</Button>
        </Tile>
        <Tile>
          <p class="text-lg text-brand-800 font-semibold">
            Discover how empathy can transform your therapy experience,
            fostering deeper connection and understanding
          </p>
          <Button>The Role of Empathy in Healing</Button>
        </Tile>
        <Tile>
          <p class="text-lg text-brand-800 font-semibold">
            Learn how systemic psychotherapy can help you uncover your strengths
            and resilience, guiding you through life's challenges
          </p>
          <Button>Building Resilience Through Self-Discovery</Button>
        </Tile>
      </div>
      <div
        id="contact"
        class="h-[60vmax] md:h-[30vmax] grid gap-4 sm:grid-cols-2"
      >
        <Tile>
          <Button>Get in contact</Button>
        </Tile>
        <Tile>
          <Button>Make an appointment</Button>
        </Tile>
      </div>
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
