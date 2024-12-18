<script lang="ts">
  import { importCDC } from '../../../api/EpiData';
  import { cdcLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { apiKey, formSelections } from '../../../store';

  export let id: string;

  export function importDataSet() {
    return importCDC({ locations: $formSelections.cdc.locations, auth: $apiKey });
  }
</script>

<TextField
  id="{id}-auth"
  name="auth"
  label="Authorizaton Token"
  bind:value={$apiKey}
  placeholder="authorization token"
/>
<SelectField id="{id}-r" label="Location" bind:value={$formSelections.cdc.locations} options={regions} />
