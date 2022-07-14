<script lang="ts">
  import { createAlert } from '$lib/alert';

  const { alertProps } = createAlert();
</script>

<div {...alertProps}>
  <slot />
</div>
