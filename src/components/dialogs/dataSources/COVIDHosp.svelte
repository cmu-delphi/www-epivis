<script lang="ts">
  import { importCOVIDHosp } from '../../../api/EpiData';
  import { covidHospLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  export function importDataSet() {
    return importCOVIDHosp({ states: $formSelections.covidHosp.states, ...$formSelections.covidHosp.issue });
  }
</script>

<SelectField id="{id}-r" label="State" bind:value={$formSelections.covidHosp.states} options={regions} />
<SelectIssue {id} bind:value={$formSelections.covidHosp.issue} hasLag={false} hasIssueDay />
