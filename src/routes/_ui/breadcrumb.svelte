<script lang="ts">
  import { createBreadcrumb } from '$lib/breadcrumb';

  export let href: string | undefined = undefined;
  export let current = false;

  const { sync } = createBreadcrumb();
  $: breadcrumbProps = sync({ current })
</script>

<li class="breadcrumb">
  {#if href !== undefined}
    <a {href} {...breadcrumbProps} {...$$restProps}><slot /></a>
  {:else}
    <span {...breadcrumbProps} {...$$restProps}><slot /></span>
  {/if}
</li>

<style>
  .breadcrumb:not(:first-child)::before {
    display: inline-block;
    margin: 0 0.5em;
    transform: rotate(15deg);
    border-right: 0.1em solid currentcolor;
    height: 0.8em;
    content: "";
  }
</style>
