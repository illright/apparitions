<script lang="ts">
  import { createMenuItemRadio } from '$lib/menu';

  export let label: string;
  export let checked = false;
  export let disabled = false;

  const { asMenuItemRadio, sync, checkedStore } = createMenuItemRadio();
  $: menuItemRadioProps = sync({ checked, disabled });
  $: checked = $checkedStore;
</script>

<div use:asMenuItemRadio {...menuItemRadioProps}>
  {label}
</div>
