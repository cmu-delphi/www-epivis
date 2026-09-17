<script lang="ts">
  import { FLUVIEW_CLINICAL_SENTINEL_SIGNAL, fluViewV5Geo, importFluViewClinical } from '../../../api/EpiData';
  import { isAvailableInV5 } from '../../../api/v5Availability';
  import { fluViewRegions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  // v5 has no publication-lag concept, so the lag option is offered only for
  // selections that will actually be served by v4 - see FluView.svelte.
  let v5HasClinical = false;
  void isAvailableInV5('fluview_resp_lab_clinical', FLUVIEW_CLINICAL_SENTINEL_SIGNAL).then((available) => {
    v5HasClinical = available;
  });
  $: hasLag = !(v5HasClinical && fluViewV5Geo($formSelections.fluViewClinical.locations) != null);

  export function importDataSet() {
    return importFluViewClinical({
      regions: $formSelections.fluViewClinical.locations,
      ...$formSelections.fluViewClinical.issue,
    });
  }
</script>

<SelectField
  id="{id}-r"
  label="Region"
  bind:value={$formSelections.fluViewClinical.locations}
  options={fluViewRegions}
/>
<SelectIssue {id} bind:value={$formSelections.fluViewClinical.issue} {hasLag} />
