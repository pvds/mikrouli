import {
  component$,
  Slot,
  useSignal,
  useStylesScoped$,
} from '@builder.io/qwik';

import styles from './tile.css?inline';

interface ChildProps {
  hasBg?: boolean;
  softBg?: boolean;
}

export const Tile = component$((props: ChildProps) => {
  useStylesScoped$(styles);
  const hasBg = useSignal(props.hasBg ?? true);

  return (
    <section
      class={{
        'bg-accent-50 rounded': hasBg.value,
        'grid items-end justify-end h-full p-2': true,
      }}
    >
      <Slot />
    </section>
  );
});
