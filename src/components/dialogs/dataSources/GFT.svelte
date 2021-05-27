<script lang="ts">
  import { importGFT } from '../../../api/EpiData';
  import { gftLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';

  export let id: string;

  let locations = regions[0].value;

  export function importDataSet() {
    return importGFT({ locations });
  }
</script>

<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
