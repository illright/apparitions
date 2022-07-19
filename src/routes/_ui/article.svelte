<script lang="ts">
  import { createArticle } from '$lib/feed';

  export let positionInFeed: number;

  const { sync, label, description } = createArticle();
  $: articleProps = sync({ positionInFeed });
</script>

<article {...articleProps}>
  <h1 {...label()}><slot name="title" /></h1>
  <p {...description()}><slot name="description" /></p>
</article>
