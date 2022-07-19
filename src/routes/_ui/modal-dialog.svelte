<script lang="ts">
  import { createDialog } from '$lib/dialog';
  import { createModal } from '$lib/modal';

  export let open = false;
  export let returnFocusTo: HTMLElement | undefined = undefined;

  let leastDestructiveFocusable: HTMLElement | undefined;

  const { asOverlay, sync: syncModal } = createModal();
  const { asDialog, sync: syncDialog, label, description } = createDialog();
  $: modalProps = syncModal({
    open,
    returnFocusTo,
    focusOnOpen: leastDestructiveFocusable,
  });
  $: dialogProps = syncDialog({ alert: true });
</script>

{#if open}
  <div class="overlay" use:asOverlay>
    <div class="dialog" use:asDialog {...modalProps} {...dialogProps}>
      <h1 {...label()}>Warning</h1>
      <p {...description(0)}>This is a warning dialog.</p>
      <p {...description(1)}>Please be sure you understand.</p>
      <button
        bind:this={leastDestructiveFocusable}
        on:click={() => (open = false)}>Close</button
      >
      <button on:click={() => alert('You silly')}>Destroy everything</button>
    </div>
  </div>
{/if}

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

  .dialog {
    background: white;
  }
</style>
