<script lang="ts">
  import { currentEpiWeek, epiRange, loadDataSet } from '../../../api/EpiData';

  import { firstEpiWeek, ghtLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';

  export let id: string;

  let locations = regions[0].value;
  let auth = '';
  let query = '';

  export function importDataSet() {
    const regionLabel = regions.find((d) => d.value === locations)?.label ?? '?';
    const title = `GHT: ${regionLabel} [${query}]`;
    return loadDataSet(
      title,
      'ght',
      {
        epiweeks: epiRange(firstEpiWeek.ght, currentEpiWeek),
      },
      {
        auth,
        locations,
        query,
      },
      ['value'],
    );
  }
</script>

<TextField id="{id}-auth" name="auth" label="Authorizaton Token" bind:value={auth} placeholder="authorization token" />
<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
<TextField id="{id}-query" name="query" label="Search Query or Topic" bind:value={query} />
