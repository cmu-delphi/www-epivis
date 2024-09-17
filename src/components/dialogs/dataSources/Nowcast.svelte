<script lang="ts">
  import { importNowcast } from '../../../api/EpiData';
  import { nowcastLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  let locations = $formSelections.nowcast.locations;

  export function importDataSet() {
    return importNowcast({ locations });
  }
</script>

<SelectField id="{id}-r" label="Location" bind:value={$formSelections.nowcast.locations} options={regions} />
