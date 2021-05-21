<script lang="ts">
  import { currentEpiWeek, epiRange, loadDataSet } from '../../../api/EpiData';

  import { firstEpiWeek, nowcastLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';

  export let id: string;

  let locations = regions[0].value;

  export function importDataSet() {
    const regionLabel = regions.find((d) => d.value === locations)?.label ?? '?';
    const title = `Delphi Nowcast: ${regionLabel}`;
    return loadDataSet(
      title,
      'nowcast',
      {
        epiweeks: epiRange(firstEpiWeek.nowcast, currentEpiWeek),
      },
      {
        locations,
      },
      ['value', 'std'],
    );
  }
</script>

<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
