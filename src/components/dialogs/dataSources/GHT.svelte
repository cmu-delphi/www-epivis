<script lang="ts">
  import { importGHT } from '../../../api/EpiData';
  import { ghtLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { apiKey, formSelections } from '../../../store';

  export let id: string;

  export function importDataSet() {
    return importGHT({ auth: $apiKey, locations: $formSelections.ght.locations, query: $formSelections.ght.query });
  }
</script>

<TextField
  id="{id}-auth"
  name="auth"
  label="Authorizaton Token"
  bind:value={$apiKey}
  placeholder="authorization token"
/>
<SelectField id="{id}-r" label="Location" bind:value={$formSelections.ght.locations} options={regions} />
<TextField id="{id}-query" name="query" label="Search Query or Topic" bind:value={$formSelections.ght.query} />
