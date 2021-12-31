<script lang="ts">
  import DivButton from '../../src/userland/div-button.svelte';

  export let content: string;
</script>

<DivButton>
  <span>{content}</span>
</DivButton>
