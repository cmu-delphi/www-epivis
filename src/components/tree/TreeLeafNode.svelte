<script lang="ts">
  import type DataSet from '../../data/DataSet';
  import { activeDatasets, autoFit } from '../../store';
  import Fa from 'svelte-fa';
  import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
  import type { IChart } from '../store';

  export let node: DataSet;
  export let chart: IChart | null;

  function toggleSelected() {
    if (selected) {
      $activeDatasets = $activeDatasets.filter((d) => d !== node);
    } else {
      $activeDatasets = [node, ...$activeDatasets];
    }
  }
  $: {
    // runs whenever $activeDatasets is updated
    if ($activeDatasets && chart && $autoFit) {
      chart.fitData(true);
    }
  }
  $: selected = $activeDatasets.includes(node);
  $: color = $activeDatasets.includes(node) ? node.color : undefined;
</script>

<div
  class="tv_node"
  class:selected
  on:click={toggleSelected}
  title="click to toggle the visibility of this dataset"
  uk-tooltip="pos: right"
>
  <Fa icon={selected ? faEye : faEyeSlash} {color} style="width: 1em; margin-right: 0.5em" />
  <span>
    {node.title}
  </span>
</div>

<style>
  div.tv_node {
    padding-left: 1em;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.125s ease-in-out;
    display: flex;
    align-items: center;
  }
  div.tv_node.selected {
    opacity: 1;
  }
  div.tv_node:hover {
    opacity: 1;
  }
  div.tv_node.selected:hover {
    opacity: 0.8;
  }
</style>
