<script lang="ts">
  import Chart from './components/Chart.svelte';
  import LeftMenu from './components/LeftMenu.svelte';
  import TopMenu from './components/TopMenu.svelte';
  import { activeDatasets, initialViewport, isShowingPoints, navMode } from './store';
  import type { IChart } from './store';
  import { onMount } from 'svelte';
  import { tour } from './tour';
  import { addDataSet } from './store';
  import { fluViewRegions } from './data/data';
  import { DEFAULT_ISSUE } from './components/dialogs/utils';
  import { importFluView } from './api/EpiData';

  let chart: Chart | null = null;
  $: ichart = chart as unknown as IChart | null;

  onMount(() => {
    if (!localStorage.getItem('shepherd-tour')) {
      tour.start();
    }

    // Try fetching the default FluView dataset! (unless the URL has a shared dataset in it)
    const url = new URL(location.href);
    const hash = url.hash.slice(1);
    if (!hash) {
      let regions = fluViewRegions[0].value;
      let issue = DEFAULT_ISSUE;
      let auth: string = '';

      importFluView({ regions, ...issue, auth }).then((ds) => {
        if (ds) {
          // add the dataset itself
          addDataSet(ds);
          // reset active datasets to fluview -> ili
          $activeDatasets = [ds.datasets[1]];
          if (chart) {
            chart.fitData(true, ds.datasets[1]);
          }
        }
      });
    }
  });
</script>

<TopMenu chart={ichart} style="grid-area: menu" />
<LeftMenu chart={ichart} style="grid-area: side; max-height: 100vh; overflow: scroll" />
<Chart
  bind:this={chart}
  style="grid-area: main"
  bind:showPoints={$isShowingPoints}
  bind:navMode={$navMode}
  initialViewport={$initialViewport}
  datasets={$activeDatasets}
/>
