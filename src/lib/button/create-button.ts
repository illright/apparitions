import type { Writable } from 'svelte/store';

import type { ButtonParameters } from './parameters';
import type { SvelteAction } from '../svelte-action';

import { trackPressInSvelte } from '../interactions/track-press-svelte';

/*
  As a user,
    I want to turn any HTML element into a button.
    I want the button to dispatch 'press' events on click, touch and keyboard activation
    I want to be able to disable the button
    I want to style a disabled button differently
    I want to add any <button> HTML attributes to the button and have the functionality mimicked
    I want the button to recognise when it's placed inside a <form> and attach to it.
    I want to avoid defining a props interface for the button when I don't need to.
    I want to opt out of the default props interface if I want to.
    I want to avoid defining an events interface for the button when I don't need to.
    I want to define and dispatch custom events on the button.
    I want the button to become focused when it is clicked, but have it "focus-visible".
    I want to be able to give the button an accessible name without writing text inside.
    I want to be able to focus the button.
    I want to have a simpler button for cases when I don't need rich content.
*/

export interface ButtonApparition {
  asButton: SvelteAction<ButtonParameters>;
  pressed: Writable<boolean>;
}

export function createButton(): ButtonApparition {
  const { pressed, tracker } = trackPressInSvelte();

  return {
    asButton: (node, parameters) => {
      tracker.setParameters(parameters);
      tracker.attach(node);

      return {
        update: tracker.setParameters,
        destroy: tracker.destroy,
      };
    },
    pressed,
  };
}
