import {
  component$,
  Slot,
  useSignal,
  useStylesScoped$,
} from '@builder.io/qwik';

import styles from './tile.css?inline';

interface ChildProps {
  hasBg?: boolean;
  hasPadding?: boolean;
}

export const Tile = component$((props: ChildProps) => {
  useStylesScoped$(styles);
  const hasBg = useSignal(props.hasBg ?? true);
  const hasPadding = useSignal(props.hasPadding ?? true);

  return (
    <section
      class={{
        'bg-accent-50 rounded-lg': hasBg.value,
        'p-2': hasPadding.value,
        'grid items-end justify-end h-full': true,
      }}
    >
      <Slot />
    </section>
  );
});
