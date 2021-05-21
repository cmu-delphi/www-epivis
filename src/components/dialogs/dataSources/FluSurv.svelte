<script lang="ts">
  import { firstEpiWeek, fluSurvRegions as regions } from '../../../data/data';
  import { appendIssueToTitle, DEFAULT_ISSUE } from '../utils';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import { currentEpiWeek, loadDataSet, epiRange } from '../../../api/EpiData';

  export let id: string;

  let locations = regions[0].value;
  let issue = DEFAULT_ISSUE;

  export function importDataSet() {
    const regionLabel = regions.find((d) => d.value === locations)?.label ?? '?';
    const title = appendIssueToTitle(`FluSurv: ${regionLabel}`, issue);
    return loadDataSet(
      title,
      'flusurv',
      {
        epiweeks: epiRange(firstEpiWeek.flusurv, currentEpiWeek),
      },
      {
        locations,
        ...issue,
      },
      ['rate_age_0', 'rate_age_1', 'rate_age_2', 'rate_age_3', 'rate_age_4', 'rate_overall'],
    );
  }
</script>

<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
<SelectIssue {id} bind:value={issue} />
