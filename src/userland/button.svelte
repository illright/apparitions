<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { createButton } from 'apparitions';

  // In order to remove the call to the apparition constructor, we need:
  // - to see which values are used upon destruction
  //   PITFALL: what if the object won't be destructed?
  // - to see which arguments are passed to the constructor
  // - to see which element the apparition is attached to
  const { asButton, isPressed } = createButton({ dispatch: createEventDispatcher() });
</script>

<h1 use:asButton>
  {#if $isPressed}
    Oooh, you touch my tra-la-la
  {:else}
    Welcome to SvelteKitd
  {/if}
</h1>
