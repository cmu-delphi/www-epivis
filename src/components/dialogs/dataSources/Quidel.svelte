<script lang="ts">
  import { importQuidel } from '../../../api/EpiData';
  import { quidelLocations as regions } from '../../../data/data';
  import { apiKey } from '../../../store';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';

  export let id: string;

  let locations = regions[0].value;
  let auth = $apiKey;

  export function importDataSet() {
    return importQuidel({ auth, locations });
  }
</script>

<TextField
  id="{id}-auth"
  name="auth"
  label="Authorizaton Token"
  bind:value={$apiKey}
  placeholder="authorization token"
/>
<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
