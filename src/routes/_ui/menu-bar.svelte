<script lang="ts">
  import { createMenuBar } from '$lib/menu';

  export let label: string;

  const { asMenuBar, sync } = createMenuBar();
  $: menuBarProps = sync({ label })
</script>

<div use:asMenuBar {...menuBarProps}>
  <slot />
</div>
