<script lang="ts">
  import { FLUVIEW_SENTINEL_SIGNAL, fluViewV5Geo, importFluView } from '../../../api/EpiData';
  import { isAvailableInV5 } from '../../../api/v5Availability';
  import { fluViewRegions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { apiKey, formSelections } from '../../../store';

  export let id: string;

  // v5 has no publication-lag concept, so the lag option is offered only for
  // selections that will actually be served by v4 - either because v5 does not
  // carry ILINet yet, or because the chosen region has no v5 equivalent (the
  // territories, the three cities and ny_minus_jfk, which stay on v4).
  let v5HasIlinet = false;
  void isAvailableInV5('fluview_ilinet', FLUVIEW_SENTINEL_SIGNAL).then((available) => {
    v5HasIlinet = available;
  });
  $: hasLag = !(v5HasIlinet && fluViewV5Geo($formSelections.fluView.locations) != null);

  export function importDataSet() {
    return importFluView({
      regions: $formSelections.fluView.locations,
      ...$formSelections.fluView.issue,
      auth: $apiKey,
    });
  }
</script>

<SelectField id="{id}-r" label="Region" bind:value={$formSelections.fluView.locations} options={fluViewRegions} />
<SelectIssue {id} bind:value={$formSelections.fluView.issue} {hasLag} />
<TextField
  id="{id}-auth"
  name="auth"
  label="Auth Key"
  bind:value={$apiKey}
  required={false}
  placeholder="authorization token"
/>
