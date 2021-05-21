<script lang="ts">
  import { firstEpiWeek, fluViewRegions } from '../../../data/data';
  import { appendIssueToTitle, DEFAULT_ISSUE } from '../utils';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { currentEpiWeek, epiRange, loadDataSet } from '../../../api/EpiData';

  export let id: string;

  let regions = fluViewRegions[0].value;
  let issue = DEFAULT_ISSUE;
  let auth: string = '';

  export function importDataSet() {
    const regionLabel = fluViewRegions.find((d) => d.value === regions)?.label ?? '?';
    const title = appendIssueToTitle(`[API] FluView: ${regionLabel}`, issue);
    return loadDataSet(
      title,
      'fluview',
      {
        epiweeks: epiRange(firstEpiWeek.fluview, currentEpiWeek),
      },
      {
        regions,
        ...issue,
        auth,
      },
      [
        'wili',
        'ili',
        'num_ili',
        'num_patients',
        'num_providers',
        'num_age_0',
        'num_age_1',
        'num_age_2',
        'num_age_3',
        'num_age_4',
        'num_age_5',
      ],
    );
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
