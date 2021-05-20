<script lang="ts">
  import { fluSurvRegions, } from '../../../data/data';
  import { DEFAULT_ISSUE } from '../utils';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { loadDataSet } from '../../../api/EpiData';

  export let id: string;

  let region = fluSurvRegions[0].value;
  let issue = DEFAULT_ISSUE;

  // eslint-disable-next-line no-unused-vars
  export function importDataSet() {
    // TODO

    const regionLabel = fluSurvRegions.find((d) => d.value === region)?.label ?? '?';
    let title = `FluView: ${regionLabel}`;

    if (issue.mode === 'asof') {
      title = `${title} (reported: ${Math.floor(issue.param/ 100)}w${issue.param%100})`;
    } else if (issue.mode === 'lag') {
      title = `${title} (lagged ${issue.param} week${issue.param != 1 ? 's' :''})`;
    }
    return loadDataSet(title, 'flusurv', {
      locations: region,
      issue: issue.mode === 'asof' ? issue.param : null,
      lag: issue.mode === 'lag' ? issue.param : null,
    },
    ['wili', 'ili', 'num_ili', 'num_patients', 'num_providers', 'num_age_0', 'num_age_1', 'num_age_2', 'num_age_3', 'num_age_4', 'num_age_5']);
  }

</script>

<SelectField id="{id}-r" label="Location" bind:value={region} options={fluSurvRegions} />
<SelectIssue {id} bind:value={issue} />
