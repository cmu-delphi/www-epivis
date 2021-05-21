<script lang="ts">
  import { currentEpiWeek, epiRange, loadDataSet } from '../../../api/EpiData';

  import { firstEpiWeek, cdcLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';

  export let id: string;

  let locations = regions[0].value;
  let auth = '';

  export function importDataSet() {
    const regionLabel = regions.find((d) => d.value === locations)?.label ?? '?';
    const title = `CDC Page Hits: ${regionLabel}`;
    return loadDataSet(
      title,
      'cdc',
      {
        epiweeks: epiRange(firstEpiWeek.cdc, currentEpiWeek),
      },
      {
        auth,
        locations,
      },
      ['total', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8'],
    );
  }
</script>

<TextField id="{id}-auth" name="auth" label="Authorizaton Token" bind:value={auth} placeholder="authorization token" />
<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
