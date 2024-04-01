import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Button } from '../components/button/button';
import { Tile } from '../components/tile/tile';

// import Image from '../media/tree-mikrouli.webp?jsx';

export default component$(() => {
  return (
    <div class="grid gap-4">
      <div
        id="blog"
        class="h-[40vmax] md:h-[20vmax] grid gap-4 xs:grid-cols-2 md:grid-cols-4"
      >
        <Tile>
          <Button>Blogpost 1</Button>
        </Tile>
        <Tile>
          <Button>Blogpost 2</Button>
        </Tile>
        <Tile>
          <Button>Blogpost 3</Button>
        </Tile>
        <Tile>
          <Button>Blogpost 4</Button>
        </Tile>
      </div>
      <div id="intro" class="h-[20vmax] grid">
        <Tile hasBg={false} />
      </div>
      <div
        id="services"
        class="h-[40vmax] md:h-[20vmax] grid gap-4 sm:grid-cols-2 md:grid-cols-3"
      >
        <Tile>
          <Button>Service 1</Button>
        </Tile>
        <Tile>
          <Button>Service 2</Button>
        </Tile>
        <Tile>
          <Button>Service 3</Button>
        </Tile>
      </div>
      <div id="about" class="min-h-[20vmax] grid">
        {/*<div class="relative">*/}
        {/*  <Image class="w-full h-full" />*/}
        {/*  <div class="absolute top-0 w-full h-full bg-white opacity-90"></div>*/}
        {/*</div>*/}
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
