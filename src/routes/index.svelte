<script lang="ts">
  import Breadcrumbs from "./_ui/breadcrumbs.svelte";
  import Breadcrumb from "./_ui/breadcrumb.svelte";
</script>

<Breadcrumbs aria-label="Breadcrumbs">
  <Breadcrumb href="/">Home</Breadcrumb>
  <Breadcrumb href="/admin">Admin</Breadcrumb>
  <Breadcrumb current>Profile</Breadcrumb>
</Breadcrumbs>


