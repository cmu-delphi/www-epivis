<script lang="ts">
  import { importQuidel } from '../../../api/EpiData';
  import { quidelLocations as regions } from '../../../data/data';
  import { apiKeySelections } from '../../../store';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';

  export let id: string;

  let locations = regions[0].value;
  let auth = $apiKeySelections.quidel;

  export function importDataSet() {
    return importQuidel({ auth, locations });
  }
</script>

<TextField
  id="{id}-auth"
  name="auth"
  label="Authorizaton Token"
  bind:value={$apiKeySelections.quidel}
  placeholder="authorization token"
/>
<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
