<script lang="ts">
  import Accordion from './_ui/accordion.svelte';
  import AccordionSection from './_ui/accordion-section.svelte';
</script>

<Accordion>
  <AccordionSection>
    <svelte:fragment slot="header">
      I'll hold you closely, I won't forget
    </svelte:fragment>
    <svelte:fragment slot="panel">
      All the things that you have said
    </svelte:fragment>
  </AccordionSection>
  <AccordionSection>
    <svelte:fragment slot="header">
      I'll hold on tightly and not regret
    </svelte:fragment>
    <svelte:fragment slot="panel">
      All the time that we've spent
    </svelte:fragment>
  </AccordionSection>
  <AccordionSection>
    <svelte:fragment slot="header">
      So hold me closely and don't forget
    </svelte:fragment>
    <svelte:fragment slot="panel">
      All the things that I have said
    </svelte:fragment>
  </AccordionSection>
  <AccordionSection>
    <svelte:fragment slot="header">
      Hold on tightly and don't regret
    </svelte:fragment>
    <svelte:fragment slot="panel">
      And don't forget <br />
      I won't forget you
    </svelte:fragment>
  </AccordionSection>
</Accordion>
