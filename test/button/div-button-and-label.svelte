<script lang="ts">
  import DivButton from '$userland/div-button.svelte';

  export let labelText: string;
</script>

<div id="label">{labelText}</div>
<DivButton aria-labelledby="label">
  <slot />
</DivButton>
