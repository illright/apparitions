<script lang="ts">
  import { createCombobox } from '$lib/combobox';

  export let value: string;
  export let required = false;
  export let editable = false;

  const { asCombobox, sync, valueStore } = createCombobox();
  $: comboboxProps = sync({ value, required, editable });
  $: value = $valueStore;
</script>

<div>
  {#if editable}
    <input use:asCombobox {...comboboxProps} />
  {:else}
    <div use:asCombobox {...comboboxProps} />
  {/if}
  <!-- TODO: think about composition
    <button use:asMenuButton {...menuButtonProps} /> -->
</div>
