<script lang="ts">
  import { importFluSurv } from '../../../api/EpiData';

  import { fluSurvRegions as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  let locations = $formSelections.fluSurv.locations;
  let issue = $formSelections.fluSurv.issue;

  export function importDataSet() {
    return importFluSurv({ locations, ...issue });
  }
</script>

<SelectField id="{id}-r" label="Location" bind:value={$formSelections.fluSurv.locations} options={regions} />
<SelectIssue {id} bind:value={$formSelections.fluSurv.issue} />
