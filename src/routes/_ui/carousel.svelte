<script lang="ts">
  import { createCarousel } from '$lib/carousel';

  let rotating = false;

  const { asCarousel, sync, currentSlide } = createCarousel();
  $: [carouselProps, slideContainerProps] = sync({
    region: true,
    tabbed: true,
    autoRotate: rotating ? 3000 : undefined,
  });
</script>

<div use:asCarousel {...carouselProps}>
  <button on:click={() => (rotating = !rotating)}>
    {#if rotating}
      Pause
    {:else}
      Play
    {/if}
  </button>
  <button on:click={currentSlide.prev}>Prev</button>
  <button on:click={currentSlide.next}>Next</button>
  <input
    type="range"
    min="0"
    max={currentSlide.length - 1}
    bind:value={$currentSlide}
  />
  <div {...slideContainerProps}>
    <slot />
  </div>
</div>
