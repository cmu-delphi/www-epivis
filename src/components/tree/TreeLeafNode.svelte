<script lang="ts">
  import type DataSet from '../../data/DataSet';
  import { activeDatasets } from '../../store';
  import Fa from 'svelte-fa';
  import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';

  export let node: DataSet;

  function toggleSelected() {
    if (selected) {
      $activeDatasets = $activeDatasets.filter((d) => d !== node);
    } else {
      $activeDatasets = [node, ...$activeDatasets];
    }
  }
  $: selected = $activeDatasets.includes(node);
</script>

<div class="tv_node" class:selected on:click={toggleSelected}>
  <Fa icon={selected ? faCheckSquare : faSquare} />
  {node.title}
</div>

<style>
  div.tv_node {
    padding-left: 1em;
    cursor: pointer;
  }
</style>
