<script lang="ts">
  import { createDisclosure } from '$lib/disclosure';

  let open = false;

  const { sync } = createDisclosure();
  $: [toggleProps, contentProps] = sync({ open });
</script>

<div>
  <button {...toggleProps} on:click={() => (open = !open)}>Toggle</button>
  {#if open}
    <div {...contentProps}>Hello world!</div>
  {/if}
</div>
