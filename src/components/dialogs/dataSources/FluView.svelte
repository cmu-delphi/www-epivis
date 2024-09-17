<script lang="ts">
  import { importFluView } from '../../../api/EpiData';
  import { fluViewRegions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  let regions = $formSelections.fluView.locations;
  let issue = $formSelections.fluView.issue;
  let auth: string = '';

  export function importDataSet() {
    return importFluView({ regions, ...issue, auth });
  }
</script>

<SelectField id="{id}-r" label="Region" bind:value={$formSelections.fluView.locations} options={fluViewRegions} />
<SelectIssue {id} bind:value={$formSelections.fluView.issue} />
<TextField
  id="{id}-auth"
  name="auth"
  label="Auth Key"
  bind:value={auth}
  required={false}
  placeholder="authorization token"
/>
