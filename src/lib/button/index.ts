import type { createEventDispatcher } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export interface ButtonEvents {
  press: void;
}

export class ButtonApparition {
  private dispatch: ReturnType<typeof createEventDispatcher<ButtonEvents>>;

  public isPressed: Writable<boolean>;

	constructor({ dispatch }: { dispatch: ReturnType<typeof createEventDispatcher> }) {
    this.isPressed = writable(false);
		this.dispatch = dispatch;

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
	}

	onMouseDown() {
    this.isPressed.set(true);
	}

	onMouseUp() {
    this.isPressed.set(false);
		this.dispatch('press');
  }
}
