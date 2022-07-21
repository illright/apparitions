<script lang="ts">
  import { createOption } from '$lib/listbox';

  export let value: string;

  const { asOption, sync, selected } = createOption();
  $: optionProps = sync({ value });
</script>

<div class:selected={$selected} use:asOption {...optionProps}>
  <slot />
</div>
