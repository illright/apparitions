<script lang="ts">
  import Button from '../../src/routes/_ui/button.svelte';
</script>

<Button disabled on:press={() => console.log('pressed')}>text</Button>
