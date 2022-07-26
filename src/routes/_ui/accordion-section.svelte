<script lang="ts">
  import { createAccordionSection } from '$lib/accordion';

  export let open = false;

  const { asHeader, react, openStore } = createAccordionSection();
  $: [headerProps, panelProps] = react({ open });
  $: open = $openStore;
</script>

<h2>
  <div use:asHeader {...headerProps}>
    <slot name="header" />
  </div>
</h2>
{#if open}
  <div {...panelProps}>
    <slot name="panel" />
  </div>
{/if}
