<script lang="ts">
import { browser } from '$app/env';

	import { createEventDispatcher } from 'svelte';

  export let disabled: boolean;

  function createButton(node: HTMLElement, props: {}) {
    node.addEventListener('click', () => {});
    node.setAttribute('disabled', props.disabled)
  }

  function defaultAttrs(props) {
    if (browser) return {};
    const plainButton = document.createElement('button');
    const b = document.createElement('button');
    createButton(b, props);
    return diff(b.attributes, plainButton.attributes);
  }
</script>

<h1 use:createButton={{ disabled }} {...defaultAttrs({ disabled })}>
  {#if $isPressed}
  Oooh, you touch my tra-la-la
  {:else}
  Welcome to SvelteKitd
  {/if}
</h1>
