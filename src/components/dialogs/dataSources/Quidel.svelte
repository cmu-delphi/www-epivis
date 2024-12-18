<script lang="ts">
  import { importQuidel } from '../../../api/EpiData';
  import { quidelLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { apiKey, formSelections } from '../../../store';

  export let id: string;

  export function importDataSet() {
    return importQuidel({ auth: $apiKey, locations: $formSelections.quidel.locations });
  }
</script>

<TextField
  id="{id}-auth"
  name="auth"
  label="Authorizaton Token"
  bind:value={$apiKey}
  placeholder="authorization token"
/>
<SelectField id="{id}-r" label="Location" bind:value={$formSelections.quidel.locations} options={regions} />
