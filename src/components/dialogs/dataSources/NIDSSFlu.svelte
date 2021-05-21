<script lang="ts">
  import { importNIDSSFlu } from '../../../api/EpiData';
  import { nidssFluLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { DEFAULT_ISSUE } from '../utils';

  export let id: string;

  let locations = regions[0].value;
  let issue = DEFAULT_ISSUE;

  export function importDataSet() {
    return importNIDSSFlu({ regions: locations, ...issue });
  }
</script>

<SelectField id="{id}-r" label="Region" bind:value={locations} options={regions} />
<SelectIssue {id} bind:value={issue} />
