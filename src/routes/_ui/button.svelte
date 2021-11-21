<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import button from '$lib/button';
  import type { ButtonEvents } from '$lib/button';

  export let disabled = false;

  interface MyEventMap extends ButtonEvents {
    click: number;
  }

  const dispatch = createEventDispatcher<MyEventMap>();
</script>

<div
  class="my-button"
  class:disabled
  use:button={{ dispatch, disabled }}
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
