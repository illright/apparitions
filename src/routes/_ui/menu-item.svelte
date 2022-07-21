<script lang="ts">
  import { createMenuItem } from '$lib/menu';

  export let label: string;
  export let disabled = false;

  const { asMenuItem, sync } = createMenuItem();
  $: menuItemProps = sync({ disabled });
</script>

<div use:asMenuItem {...menuItemProps}>
  {label}
</div>
<slot />
