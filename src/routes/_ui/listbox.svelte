<script lang="ts">
  import { createListbox } from '$lib/listbox';

  export let value: string | undefined;

  const { asListbox, sync, valueStore } = createListbox<string>();
  $: listboxProps = sync({ value });
  $: value = $valueStore;
</script>

<div use:asListbox {...listboxProps}>
  <slot />
</div>
