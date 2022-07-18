<script lang="ts">
  import { createToggleButton } from '$lib/toggle-button';

  export let disabled = false;
  export let selected = false;

  const { asToggleButton, sync, pressed, selectedStore } = createToggleButton();
  $: attributes = sync({ disabled, selected });
  $: selected = $selectedStore;
</script>

<div
  use:asToggleButton
  class:pressed={$pressed}
  {...attributes}
>
  <slot />
</div>

