<script lang="ts">
  import { importSensors } from '../../../api/EpiData';
  import { sensorLocations as regions, sensorNames } from '../../../data/data';
  import { apiKey } from '../../../store';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';

  export let id: string;

  let locations = regions[0].value;
  let names = sensorNames[0].value;

  export function importDataSet() {
    return importSensors({ auth: $apiKey, names, locations });
  }
</script>

<TextField
  id="{id}-auth"
  name="auth"
  label="Authorizaton Token"
  bind:value={$apiKey}
  placeholder="authorization token"
/>
<SelectField id="{id}-s" label="Name" bind:value={names} options={sensorNames} name="sensor" />
<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
