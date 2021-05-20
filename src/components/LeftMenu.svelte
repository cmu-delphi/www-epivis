<script lang="ts">
  import { datasetTree } from '../store';

  import ImportDataSetsMenu from './ImportDataSetsMenu.svelte';
  import TreeInnerNode from './TreeInnerNode.svelte';
</script>

<side class="left" style="grid-area: side">
  <ImportDataSetsMenu />
  <TreeInnerNode node={$datasetTree} />
</side>

<style>
  .left {
    padding: 0.5em 1em 0.5em 0.5em;
    border-right: 1px solid grey;
  }
</style>
