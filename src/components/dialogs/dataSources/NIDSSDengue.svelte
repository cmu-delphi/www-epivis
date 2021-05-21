<script lang="ts">
  import { currentEpiWeek, epiRange, loadDataSet } from '../../../api/EpiData';

  import { firstEpiWeek, nidssDenqueLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';

  export let id: string;

  let locations = regions[0].value;

  export function importDataSet() {
    const regionLabel = regions.find((d) => d.value === locations)?.label ?? '?';
    const title = `NIDSS-Denque: ${regionLabel}`;
    return loadDataSet(
      title,
      'nidss_dengue',
      {
        epiweeks: epiRange(firstEpiWeek.nidss_dengue, currentEpiWeek),
      },
      {
        locations,
      },
      ['count'],
    );
  }
</script>

<SelectField id="{id}-r" label="Region" bind:value={locations} options={regions} />
