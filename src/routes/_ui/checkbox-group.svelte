<script lang="ts">
  import { createCheckboxGroup } from "$lib/checkbox";

  export let labelText: string | undefined;
  export let descriptionText: string | undefined;

  const { checkboxGroupProps, label, description } = createCheckboxGroup();
</script>

<div {...checkboxGroupProps}>
  {#if label !== undefined}
    <div {...label()}>{labelText}</div>
  {/if}
  {#if description !== undefined}
    <div {...description()}>{descriptionText}</div>
  {/if}
  <slot />
</div>
