<script lang="ts">
  import { createButton } from '$lib/button';

  export let disabled = false;

  const { asButton, sync } = createButton();
  $: attributes = sync({ disabled });
</script>

<div
  class="my-button"
  class:disabled
  use:asButton
  {...attributes}
>
  <slot />
</div>

<style>
  .my-button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    padding: 0.6em 1.1em;
    border: 1px solid #ddd;
    background-color: #eee;
  }

  .my-button.disabled {
    border-color: #eee;
    background-color: transparent;
    cursor: not-allowed;
  }
</style>
