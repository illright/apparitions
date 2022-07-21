<script lang="ts">
  import Listbox from './_ui/listbox.svelte';
  import OptionGroup from './_ui/option-group.svelte';
  import Option from './_ui/option.svelte';

  let value: string | undefined = undefined;
</script>

<Listbox bind:value>
  <OptionGroup title="Fruit">
    <Option value="apple">Apple</Option>
    <Option value="banana">Banana</Option>
    <Option value="orange">Orange</Option>
  </OptionGroup>
</Listbox>
