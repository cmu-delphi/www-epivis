<script lang="ts">
  import type DataSet from '../../data/DataSet';
  import { activeDatasets } from '../../store';
  import Fa from 'svelte-fa';
  import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

  export let node: DataSet;

  function toggleSelected() {
    if (selected) {
      $activeDatasets = $activeDatasets.filter((d) => d !== node);
    } else {
      $activeDatasets = [node, ...$activeDatasets];
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
  <Fa icon={selected ? faEye : faEyeSlash} {color} style="width: 1em" />
  {node.title}
</div>

<style>
  div.tv_node {
    padding-left: 1em;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.125s ease-in-out;
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
