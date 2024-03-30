import {
  component$,
  Slot,
  useSignal,
  useStylesScoped$,
} from '@builder.io/qwik';

import styles from './section.css?inline';

export const Section = component$(() => {
  useStylesScoped$(styles);
  const title = useSignal('');
  const description = useSignal('');

  return (
    <section>
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      <Slot />
    </section>
  );
});
