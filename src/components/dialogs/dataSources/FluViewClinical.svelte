<script lang="ts">
  import { importFluViewClinical } from '../../../api/EpiData';
  import { fluViewRegions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  export function importDataSet() {
    return importFluViewClinical({
      regions: $formSelections.fluViewClinical.locations,
      ...$formSelections.fluViewClinical.issue,
    });
  }
</script>

<SelectField
  id="{id}-r"
  label="Region"
  bind:value={$formSelections.fluViewClinical.locations}
  options={fluViewRegions}
/>
<SelectIssue {id} bind:value={$formSelections.fluViewClinical.issue} />
