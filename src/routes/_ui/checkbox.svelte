<script lang="ts">
  import { createCheckbox } from '$lib/checkbox';

  export let checked = false;
  export let disabled = false;

  const { asCheckbox, sync, checkedStore } = createCheckbox();
  $: checkboxProps = sync({ checked, disabled });
  $: checked = $checkedStore
</script>

<div use:asCheckbox {...checkboxProps}>
  <slot />
</div>
