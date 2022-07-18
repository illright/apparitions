<script lang="ts">
  if (!('aria-label' in $$restProps || 'aria-labelledby' in $$restProps)) {
    console.warn(
      '<Breadcrumbs> should be labeled with aria-labelledby or aria-label'
    );
  }
</script>

<nav {...$$restProps}>
  <ol>
    <slot />
  </ol>
</nav>

<style>
  ol {
    padding: 0;
    margin: 0;
    display: flex;
    list-style: none;
  }
</style>
