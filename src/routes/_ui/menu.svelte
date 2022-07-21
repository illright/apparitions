<script lang="ts">
  import { createMenu } from '$lib/menu';

  const { menuProps } = createMenu();
</script>

<div {...menuProps}>
  <slot />
</div>
