import { createEventDispatcher } from 'svelte';
import { writable } from 'svelte/store';

import { PressTracker } from './press-tracker';

export function trackPressInSvelte(): Record<string, any> {
  const pressed = writable(false);
  const dispatch = createEventDispatcher();

  const pressTracker = new PressTracker({
    onPress: (e) => dispatch('press', e),
    onPressChange: pressed.set,
  });

  return { pressed, tracker: pressTracker };
}
