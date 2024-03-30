import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return <>Mikrouli</>;
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
