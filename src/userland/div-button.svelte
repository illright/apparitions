<script lang="ts">
  import { createButton } from '$lib/button';

  export let disabled = false;

  const { asButton, attributes } = createButton();
</script>

<div
  use:asButton={{ disabled }}
  {...attributes({ disabled }, $$restProps, 'div')}
  class="custom-button"
>
  <slot />
</div>

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
    cursor: not-allowed;
  }

  .custom-button.pressed {
    font-weight: bolder;
  }
</style>
