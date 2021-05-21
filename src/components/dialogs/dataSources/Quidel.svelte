<script lang="ts">
  import { currentEpiWeek, epiRange, loadDataSet } from '../../../api/EpiData';

  import { firstEpiWeek, quidelLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';

  export let id: string;

  let locations = regions[0].value;
  let auth = '';

  export function importDataSet() {
    const regionLabel = regions.find((d) => d.value === locations)?.label ?? '?';
    const title = `[API] Quidel Data: ${regionLabel}`;
    return loadDataSet(
      title,
      'quidel',
      {
        epiweeks: epiRange(firstEpiWeek.quidel, currentEpiWeek),
      },
      {
        auth,
        locations,
      },
      ['value'],
    );
  }
</script>

<TextField id="{id}-auth" name="auth" label="Authorizaton Token" bind:value={auth} placeholder="authorization token" />
<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
