<script lang="ts">
  import { createSlide } from '$lib/carousel';

  const { slideProps } = createSlide();
</script>

<div {...slideProps}><slot /></div>
