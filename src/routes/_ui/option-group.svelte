<script lang="ts">
  import { createOptionGroup } from '$lib/listbox';

  export let title: string;

  const { optionGroupProps, label } = createOptionGroup();
</script>

<div {...optionGroupProps}>
  <div {...label()}>{title}</div>
  <slot />
</div>
