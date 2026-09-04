<script lang="ts">
  import type DataSet from '../../data/DataSet';
  import { activeDatasets, navMode } from '../../store';
  import Fa from 'svelte-fa';
  import { faEyeSlash, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
  import type { IChart } from '../../store';
  import { NavMode } from '../chartUtils';

  export let node: DataSet;
  export let chart: IChart | null;
  export let onRemove: (() => void) | undefined = undefined;

  function toggleSelected() {
    if (selected) {
      $activeDatasets = $activeDatasets.filter((d) => d !== node);
    } else {
      $activeDatasets = [node, ...$activeDatasets];
    }
  }
  $: {
    // runs whenever $activeDatasets is updated
    if ($activeDatasets && chart && $navMode == NavMode.autofit) {
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
  <Fa icon={selected ? faEye : faEyeSlash} {color} style="width: 1em; margin-right: 0.5em; flex-shrink: 0" />
  <span class="title-text">
    {node.displayTitle()}
  </span>
  {#if onRemove}
    <span
      class="remove-icon"
      on:click|stopPropagation={onRemove}
      title="Remove this dataset"
      uk-tooltip="pos: bottom-right"
    >
      <Fa icon={faTrash} style="width: 0.9em; margin-left: 0.5em" />
    </span>
  {/if}
</div>

<style>
  div.tv_node {
    padding-left: 1em;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.125s ease-in-out;
    display: flex;
    align-items: center;
    min-width: 0;
  }
  .title-text {
    flex: 1 1 auto;
    min-width: 0;
    overflow-wrap: anywhere;
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
  .remove-icon {
    margin-left: auto;
    opacity: 0.6;
    flex-shrink: 0;
  }
  .remove-icon:hover {
    opacity: 1;
    color: #e74c3c;
  }
</style>
