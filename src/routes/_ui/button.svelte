<script lang="ts">
  import { createButton } from '$lib/button';

  export let disabled = false;

  const { asButton, sync, pressed } = createButton();
  $: attributes = sync({ disabled });
</script>

<div
  class:disabled
  class:pressed={$pressed}
  use:asButton
  {...attributes}
>
  <slot />
</div>

<style>
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    padding: 0.6em 1.1em;
    border: 1px solid #ddd;
    background-color: #eee;
  }

  div.disabled {
    border-color: #eee;
    background-color: transparent;
    cursor: not-allowed;
  }
</style>
