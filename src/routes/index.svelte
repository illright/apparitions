<script lang="ts">
  import { createButton } from 'apparitions';


  // In order to remove the call to the apparition constructor, we need:
  // - to see which values are used upon destruction
  //   PITFALL: what if the object won't be destructed?
  // - to see which arguments are passed to the constructor
  // - to see which element the apparition is attached to
  const { asButton } = createButton();
</script>

<h1 use:asButton>Welcome to SvelteKitd</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
