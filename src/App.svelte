<script lang="ts">
  import Chart from './components/Chart.svelte';
  import LeftMenu from './components/LeftMenu.svelte';
  import TopMenu from './components/TopMenu.svelte';
  import { activeDatasets, initialViewport, isShowingPoints, navMode } from './store';
  import type { IChart } from './store';

  let chart: Chart | null = null;
  $: ichart = chart as unknown as IChart | null;
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
