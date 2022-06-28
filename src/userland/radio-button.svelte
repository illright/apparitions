<script lang="ts">
  import { createEventDispatcher, type RadioEvents } from 'svelte';
  import { createRadioButton as myRadioButton } from 'apparitions';

  export let value: boolean = false;
  const dispatcher = createEventDispatcher<RadioEvents>();

  const myRadio = createRadioButton;

  const { asRadioButton, asLabel, isPressed, defaultAttrs } = myRadio({ dispatcher });
</script>

<input use:asRadioButton={{ value }} {...defaultAttrs} />
<span use:asLabel></span>
