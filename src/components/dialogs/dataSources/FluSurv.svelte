<script lang="ts">
  import { importFluSurv } from '../../../api/EpiData';

  import { fluSurvRegions as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { DEFAULT_ISSUE } from '../utils';

  export let id: string;

  let locations = regions[0].value;
  let issue = DEFAULT_ISSUE;

  export function importDataSet() {
    return importFluSurv({ locations, ...issue });
  }
</script>

<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
<SelectIssue {id} bind:value={issue} />
