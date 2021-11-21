<script lang="ts">
  import Button from './_ui/button.svelte';
</script>

<Button disabled on:press={() => console.log('pressed')}>text</Button>
