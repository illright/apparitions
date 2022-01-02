<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let disabled = false;

  const dispatch = createEventDispatcher();
</script>

<button
  class="custom-button"
  role="button"
  on:click={() => dispatch('press')}
  aria-disabled={disabled}
  {disabled}
  {...$$restProps}
>
  <slot />
</button>

<style>
  .custom-button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0.6em 1.1em;
    border: 1px solid #ddd;
    background-color: #eee;
  }

  .custom-button[aria-disabled='true'] {
    border-color: #eee;
    background-color: transparent;
    cursor: disabled;
  }

  .custom-button.pressed {
    font-weight: bolder;
  }
</style>
