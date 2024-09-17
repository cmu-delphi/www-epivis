<script lang="ts">
  import { importQuidel } from '../../../api/EpiData';
  import { quidelLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  let locations = $formSelections.quidel.locations;
  let auth = '';

  export function importDataSet() {
    return importQuidel({ auth, locations });
  }
</script>

<TextField id="{id}-auth" name="auth" label="Authorizaton Token" bind:value={auth} placeholder="authorization token" />
<SelectField id="{id}-r" label="Location" bind:value={$formSelections.quidel.locations} options={regions} />
