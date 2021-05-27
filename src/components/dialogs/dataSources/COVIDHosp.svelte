<script lang="ts">
  import { importCOVIDHosp } from '../../../api/EpiData';
  import { covidHospLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { DEFAULT_ISSUE } from '../utils';

  export let id: string;

  let states = regions[0].value;
  let issue = DEFAULT_ISSUE;

  export function importDataSet() {
    return importCOVIDHosp({ states, ...issue });
  }
</script>

<SelectField id="{id}-r" label="State" bind:value={states} options={regions} />
<SelectIssue {id} bind:value={issue} hasLag={false} hasIssueDay />
