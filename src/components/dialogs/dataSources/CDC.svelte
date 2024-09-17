<script lang="ts">
  import { importCDC } from '../../../api/EpiData';
  import { cdcLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  let locations = $formSelections.cdc.locations;
  let auth = '';

  export function importDataSet() {
    return importCDC({ locations, auth });
  }
</script>

<TextField id="{id}-auth" name="auth" label="Authorizaton Token" bind:value={auth} placeholder="authorization token" />
<SelectField id="{id}-r" label="Location" bind:value={$formSelections.cdc.locations} options={regions} />
