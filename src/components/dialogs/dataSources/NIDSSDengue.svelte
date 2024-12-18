<script lang="ts">
  import { importNIDSSDengue } from '../../../api/EpiData';
  import { nidssDengueLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  export function importDataSet() {
    return importNIDSSDengue({ locations: $formSelections.nidssDengue.locations });
  }
</script>

<SelectField id="{id}-r" label="Region" bind:value={$formSelections.nidssDengue.locations} options={regions} />
