<script lang="ts">
  import { importFluView } from '../../../api/EpiData';
  import { fluViewRegions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { DEFAULT_ISSUE } from '../utils';

  export let id: string;

  let regions = fluViewRegions[0].value;
  let issue = DEFAULT_ISSUE;
  let auth: string = '';

  export function importDataSet() {
    return importFluView({ regions, ...issue, auth });
  }
</script>

<SelectField id="{id}-r" label="Region" bind:value={regions} options={fluViewRegions} />
<SelectIssue {id} bind:value={issue} />
<TextField
  id="{id}-auth"
  name="auth"
  label="Auth Key"
  bind:value={auth}
  required={false}
  placeholder="authorization token"
/>
