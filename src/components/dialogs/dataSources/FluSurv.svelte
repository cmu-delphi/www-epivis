<script lang="ts">
  import { FLUSURV_SENTINEL_SIGNAL, importFluSurv } from '../../../api/EpiData';
  import { isAvailableInV5 } from '../../../api/v5Availability';

  import { fluSurvRegions as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  // v5 has no publication-lag concept, so the lag option is offered only while this
  // source is still served by v4. Assume it is available until the (cached) metadata
  // check says otherwise, so the control does not flicker in on every dialog open.
  let hasLag = true;
  void isAvailableInV5('flusurv', FLUSURV_SENTINEL_SIGNAL).then((useV5) => {
    hasLag = !useV5;
  });

  export function importDataSet() {
    return importFluSurv({ locations: $formSelections.fluSurv.locations, ...$formSelections.fluSurv.issue });
  }
</script>

<SelectField id="{id}-r" label="Location" bind:value={$formSelections.fluSurv.locations} options={regions} />
<SelectIssue {id} bind:value={$formSelections.fluSurv.issue} {hasLag} />
