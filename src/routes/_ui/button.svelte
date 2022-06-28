<script lang="ts">
  import { createButton } from '$lib/button';

  export let disabled = false;

  const { asButton } = createButton();
</script>

<div
  class="my-button"
  class:disabled
  use:asButton
>
  <slot />
</div>

<style>
  .my-button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0.6em 1.1em;
    border: 1px solid #ddd;
    background-color: #eee;
  }

  .my-button.disabled {
    border-color: #eee;
    background-color: transparent;
    cursor: disabled;
  }
</style>
