<script lang="ts">
  import { createCheckbox } from '$lib/checkbox';

  export let checked = false;
  export let disabled = false;

  const { asCheckbox, sync } = createCheckbox();
  $: checkboxProps = sync({ checked, disabled });
</script>

<div use:asCheckbox {...checkboxProps}>
  <slot />
</div>
