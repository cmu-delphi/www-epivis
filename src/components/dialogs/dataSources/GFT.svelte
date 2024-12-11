<script lang="ts">
  import { importGFT } from '../../../api/EpiData';
  import { gftLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  export function importDataSet() {
    return importGFT({ locations: $formSelections.gft.locations });
  }
</script>

<SelectField id="{id}-r" label="Location" bind:value={$formSelections.gft.locations} options={regions} />
