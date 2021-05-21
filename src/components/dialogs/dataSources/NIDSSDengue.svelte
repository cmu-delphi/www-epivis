<script lang="ts">
  import { importNIDSSDenque } from '../../../api/EpiData';
  import { nidssDenqueLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';

  export let id: string;

  let locations = regions[0].value;

  export function importDataSet() {
    return importNIDSSDenque({ locations });
  }
</script>

<SelectField id="{id}-r" label="Region" bind:value={locations} options={regions} />
