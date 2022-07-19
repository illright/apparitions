<script lang="ts">
  import { createFeed } from '$lib/feed';

	export let length: number | undefined;

  const { asFeed, sync } = createFeed();
  $: feedProps = sync({ length });
</script>

<div use:asFeed {...feedProps}>
	<slot />
</div>
