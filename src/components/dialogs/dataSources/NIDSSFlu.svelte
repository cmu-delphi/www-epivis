<script lang="ts">
  import { currentEpiWeek, epiRange, loadDataSet } from '../../../api/EpiData';

  import { firstEpiWeek, nidssFluLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import SelectIssue from '../inputs/SelectIssue.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { DEFAULT_ISSUE } from '../utils';

  export let id: string;

  let locations = regions[0].value;
  let issue = DEFAULT_ISSUE;
  let auth = '';

  export function importDataSet() {
    const regionLabel = regions.find((d) => d.value === locations)?.label ?? '?';
    const title = `NIDSS Flu: ${regionLabel}`;
    return loadDataSet(
      title,
      'nidss_flu',
      {
        epiweeks: epiRange(firstEpiWeek.nidss_flu, currentEpiWeek),
      },
      {
        auth,
        ...issue,
        regions: locations,
      },
      ['visits', 'ili'],
    );
  }
</script>

<TextField id="{id}-auth" name="auth" label="Authorizaton Token" bind:value={auth} placeholder="authorization token" />
<SelectField id="{id}-r" label="Region" bind:value={locations} options={regions} />
<SelectIssue {id} bind:value={issue} />
