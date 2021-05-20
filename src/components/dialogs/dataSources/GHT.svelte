<script lang="ts">
  import { ghtLocations } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
import TextField from '../inputs/TextField.svelte';

  export let id: string;

  let location = ghtLocations[0].value;
  let auth = '';
  let query = '';
</script>

<TextField id="{id}-auth" label="Authorizaton Token" bind:value={auth} placeholder="authorization token" />
<SelectField id="{id}-r" label="Location" bind:value={location} options={ghtLocations} />
<TextField id="{id}-query" label="Search Query or Topic I" bind:value={query} />
