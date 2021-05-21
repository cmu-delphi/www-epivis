<script lang="ts">
  import { currentEpiWeek, epiRange, loadDataSet } from '../../../api/EpiData';

  import { firstEpiWeek, sensorLocations as regions, sensorNames } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';

  export let id: string;

  let locations = regions[0].value;
  let auth = '';
  let names = sensorNames[0].value;

  export function importDataSet() {
    const regionLabel = regions.find((d) => d.value === locations)?.label ?? '?';
    const namesLabel = sensorNames.find((d) => d.value === names)?.label ?? '?';
    const title = `Delphi Sensor: ${namesLabel}: ${regionLabel}`;
    return loadDataSet(
      title,
      'sensors',
      {
        epiweeks: epiRange(firstEpiWeek.sensors, currentEpiWeek),
      },
      {
        auth,
        names,
        locations,
      },
      ['value'],
    );
  }
</script>

<TextField id="{id}-auth" name="auth" label="Authorizaton Token" bind:value={auth} placeholder="authorization token" />
<SelectField id="{id}-s" label="Name" bind:value={names} options={sensorNames} name="sensor" />
<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
