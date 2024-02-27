<script lang="ts">
  import Chart from './components/Chart.svelte';
  import LeftMenu from './components/LeftMenu.svelte';
  import TopMenu from './components/TopMenu.svelte';
  import { activeDatasets, initialViewport, isShowingPoints, navMode } from './store';
  import type { IChart } from './store';
  import { onMount } from 'svelte';
  import { tour } from './tour';

  let chart: Chart | null = null;
  $: ichart = chart as unknown as IChart | null;

  onMount(() => {
    if (!localStorage.getItem('shepherd-tour')) {
      tour.start();
    }
  });
</script>

<TopMenu chart={ichart} style="grid-area: menu" />
<LeftMenu style="grid-area: side" />
<Chart
  bind:this={chart}
  style="grid-area: main"
  bind:showPoints={$isShowingPoints}
  bind:navMode={$navMode}
  initialViewport={$initialViewport}
  datasets={$activeDatasets}
/>
