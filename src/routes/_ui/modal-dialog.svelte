<script lang="ts">
  import { createDialog } from '$lib/dialog';
  import { createModal } from '$lib/modal';

  export let open = false;

  const { asOverlay, modalProps } = createModal();
  const { asDialog, sync, label, description } = createDialog();
  $: dialogProps = sync({ open, alert: true });
</script>

<div class="overlay" use:asOverlay>
  <div use:asDialog {...modalProps} {...dialogProps}>
    <h1 {...label()}>Warning</h1>
    <p {...description(0)}>This is a warning dialog.</p>
    <p {...description(1)}>Please be sure you understand.</p>
    <button on:click={() => (open = false)}>Close</button>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
</style>
