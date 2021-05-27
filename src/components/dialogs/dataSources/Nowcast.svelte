<script lang="ts">
  import { importNowcast } from '../../../api/EpiData';
  import { nowcastLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';

  export let id: string;

  let locations = regions[0].value;

  export function importDataSet() {
    return importNowcast({ locations });
  }
</script>

<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
