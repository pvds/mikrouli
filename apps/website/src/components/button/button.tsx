import { component$, Slot, useStylesScoped$ } from '@builder.io/qwik';

import styles from './button.css?inline';

export const Button = component$(() => {
  useStylesScoped$(styles);

  return (
    <>
      <button class="justify-self-end px-4 py-1 rounded-full bg-brand-100 text-brand-800 hover:bg-brand-200">
        <Slot />
      </button>
    </>
  );
});
