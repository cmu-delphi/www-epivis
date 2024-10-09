<script lang="ts">
  import { importNIDSSFlu } from '../../../api/EpiData';
  import { nidssFluLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  let locations = $formSelections.nidssFlu.locations;
  let issue = $formSelections.nidssFlu.issue;

  export function importDataSet() {
    return importNIDSSFlu({ regions: locations, ...issue });
  }
</script>

<SelectField id="{id}-r" label="Region" bind:value={$formSelections.nidssFlu.locations} options={regions} />
<SelectIssue {id} bind:value={$formSelections.nidssFlu.issue} />
