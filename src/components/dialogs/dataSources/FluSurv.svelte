<script lang="ts">
  import { first_epiweek, fluSurvRegions } from '../../../data/data';
  import { appendIssueToTitle, DEFAULT_ISSUE } from '../utils';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { currentEpiWeek, loadDataSet, range } from '../../../api/EpiData';

  export let id: string;

  let locations = fluSurvRegions[0].value;
  let issue = DEFAULT_ISSUE;

  export function importDataSet() {
    const regionLabel = fluSurvRegions.find((d) => d.value === locations)?.label ?? '?';
    let title = appendIssueToTitle(`FluView: ${regionLabel}`, issue);
    return loadDataSet(
      title,
      'flusurv',
      {
        epiweeks: range(first_epiweek.flusurv, currentEpiWeek),
      },
      {
        locations,
        issue: issue.mode === 'asof' ? issue.param : null,
        lag: issue.mode === 'lag' ? issue.param : null,
      },
      ['rate_age_0', 'rate_age_1', 'rate_age_2', 'rate_age_3', 'rate_age_4', 'rate_overall'],
    );
  }
</script>

<SelectField id="{id}-r" label="Location" bind:value={locations} options={fluSurvRegions} />
<SelectIssue {id} bind:value={issue} />
