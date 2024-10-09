<script lang="ts">
  import { importSensors } from '../../../api/EpiData';
  import { sensorLocations as regions, sensorNames } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  let locations = $formSelections.sensors.locations;
  let auth = '';
  let names = $formSelections.sensors.names;

  export function importDataSet() {
    return importSensors({ auth, names, locations });
  }
</script>

<TextField id="{id}-auth" name="auth" label="Authorizaton Token" bind:value={auth} placeholder="authorization token" />
<SelectField id="{id}-s" label="Name" bind:value={$formSelections.sensors.names} options={sensorNames} name="sensor" />
<SelectField id="{id}-r" label="Location" bind:value={$formSelections.sensors.locations} options={regions} />
