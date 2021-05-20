<script lang="ts">
  import { fluViewRegions } from '../../../data/data';
  import { DEFAULT_ISSUE } from '../utils';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import TextField from '../inputs/TextField.svelte';
import type DataSet from '../../../data/DataSet';

  export let id: string;

  // eslint-disable-next-line no-unused-vars
  export function importDataSet(callback: (ds: DataSet) => void) {
    // TODO
  }

  let region = fluViewRegions[0].value;
  let issue = DEFAULT_ISSUE;
  let auth: string = '';
</script>

<SelectField id="{id}-r" label="Region" bind:value={region} options={fluViewRegions} />
<SelectIssue {id} bind:value={issue} />
<TextField id="{id}-auth" label="Auth Key" bind:value={auth} placeholder="authorization token" />
