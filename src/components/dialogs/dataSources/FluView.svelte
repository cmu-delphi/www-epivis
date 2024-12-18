<script lang="ts">
  import { importFluView } from '../../../api/EpiData';
  import { fluViewRegions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { apiKey, formSelections } from '../../../store';

  export let id: string;

  export function importDataSet() {
    return importFluView({
      regions: $formSelections.fluView.locations,
      ...$formSelections.fluView.issue,
      auth: $apiKey,
    });
  }
</script>

<SelectField id="{id}-r" label="Region" bind:value={$formSelections.fluView.locations} options={fluViewRegions} />
<SelectIssue {id} bind:value={$formSelections.fluView.issue} />
<TextField
  id="{id}-auth"
  name="auth"
  label="Auth Key"
  bind:value={$apiKey}
  required={false}
  placeholder="authorization token"
/>
