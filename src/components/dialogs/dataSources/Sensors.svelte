<script lang="ts">
  import { importSensors } from '../../../api/EpiData';
  import { sensorLocations as regions, sensorNames } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { apiKey, formSelections } from '../../../store';

  export let id: string;

  export function importDataSet() {
    return importSensors({
      auth: $apiKey,
      names: $formSelections.sensors.names,
      locations: $formSelections.sensors.locations,
    });
  }
</script>

<TextField
  id="{id}-auth"
  name="auth"
  label="Authorizaton Token"
  bind:value={$apiKey}
  placeholder="authorization token"
/>
<SelectField id="{id}-s" label="Name" bind:value={$formSelections.sensors.names} options={sensorNames} name="sensor" />
<SelectField id="{id}-r" label="Location" bind:value={$formSelections.sensors.locations} options={regions} />
