<script lang="ts">
  import { createMenuItemSeparator } from '$lib/menu';

  const { sync } = createMenuItemSeparator();
  $: menuItemSeparatorProps = sync({});
</script>

<hr {...menuItemSeparatorProps} />
