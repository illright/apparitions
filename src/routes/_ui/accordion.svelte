<script lang="ts">
  import { createAccordion } from '$lib/accordion';

  export let singleExpansion = false;

  const { sync } = createAccordion();
  $: accordionProps = sync({ singleExpansion });
</script>

<div {...accordionProps}>
  <slot />
</div>
