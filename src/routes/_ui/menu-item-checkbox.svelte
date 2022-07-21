<script lang="ts">
  import { createMenuItemCheckbox } from '$lib/menu';

  export let label: string;
  export let checked = false;
  export let disabled = false;

  const { asMenuItemCheckbox, sync, checkedStore } = createMenuItemCheckbox();
  $: menuItemCheckboxProps = sync({ checked, disabled });
  $: checked = $checkedStore;
</script>

<div use:asMenuItemCheckbox {...menuItemCheckboxProps}>
  {label}
</div>
