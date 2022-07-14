<script lang="ts">
  import { createAccordionSection } from '$lib/accordion';

  export let open = false;

  const { asHeader, sync } = createAccordionSection();
  $: [headerProps, panelProps] = sync({ open });
</script>

<h2>
  <div use:asHeader {...headerProps}>
    <slot name="header" />
  </div>
</h2>
<div {...panelProps}>
  <slot name="panel" />
</div>
