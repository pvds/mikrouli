import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { FaLeafSolid } from '@qwikest/icons/font-awesome';

import styles from './branding.css?inline';

export const Branding = component$(() => {
  useStylesScoped$(styles);

  return (
    <a href="/" class="flex gap-3 p-1.5 items-center text-brand-800">
      <FaLeafSolid class="flex-none size-12 self-baseline" />
      <div class="flex flex-col">
        <h1 class="text-3xl font-medium leading-none">Mikrouli</h1>
        <p class="font-light leading-none">
          Transforming Patterns, Enriching Lives
        </p>
      </div>
    </a>
  );
});
