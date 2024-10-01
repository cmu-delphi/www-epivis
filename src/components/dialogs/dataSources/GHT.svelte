<script lang="ts">
  import { importGHT } from '../../../api/EpiData';
  import { ghtLocations as regions } from '../../../data/data';
  import { apiKeySelections } from '../../../store';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';

  export let id: string;

  let locations = regions[0].value;
  let auth = $apiKeySelections.ght;
  let query = '';

  export function importDataSet() {
    return importGHT({ auth, locations, query });
  }
</script>

<TextField
  id="{id}-auth"
  name="auth"
  label="Authorizaton Token"
  bind:value={$apiKeySelections.ght}
  placeholder="authorization token"
/>
<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
<TextField id="{id}-query" name="query" label="Search Query or Topic" bind:value={query} />
