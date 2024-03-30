import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { FaLeafSolid } from '@qwikest/icons/font-awesome';

import styles from './branding.css?inline';

export const Branding = component$(() => {
  useStylesScoped$(styles);

  return (
    <>
      <a href="/" class="flex gap-2 items-center text-green-600">
        <FaLeafSolid class="w-8 h-8" />
        <h1 class="text-2xl font-medium">Mikrouli</h1>
      </a>
    </>
  );
});
