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
    <div
      class={{
        'bg-accent-50 rounded-lg': hasBg.value,
        'p-4': hasPadding.value,
      }}
    >
      <Slot />
    </div>
  );
});
