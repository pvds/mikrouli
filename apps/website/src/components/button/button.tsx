import { component$, Slot, useStylesScoped$ } from '@builder.io/qwik';

import styles from './button.css?inline';

export const Button = component$(() => {
  useStylesScoped$(styles);

  return (
    <>
      <button className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-green-600">
        <Slot />
      </button>
    </>
  );
});
