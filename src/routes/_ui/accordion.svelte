<script lang="ts">
  import { createAccordion } from '$lib/accordion';

  const { asAccordion, react } = createAccordion();
  $: react({ allowMultipleExpandedPanels: true, forbidNoExpandedPanels: true });
</script>

<div use:asAccordion>
  <slot />
</div>
