<script lang="ts">
  import DataSet from '../data/DataSet';
  import { datasetTree } from '../store';
  import ImportDataSetsMenu from './ImportDataSetsMenu.svelte';
  import TreeInnerNode from './tree/TreeInnerNode.svelte';
  import TreeLeafNode from './tree/TreeLeafNode.svelte';

  export let style = '';
</script>

<side class="left" {style} data-tour="browser">
  <ImportDataSetsMenu />
  <div class="tree">
    {#each $datasetTree.datasets as child (child.title)}
      {#if child instanceof DataSet}
        <TreeLeafNode node={child} />
      {:else}
        <TreeInnerNode node={child} />
      {/if}
    {/each}
  </div>
</side>

<style>
  .left {
    padding: 0.5em 1em 0.5em 0.5em;
    border-right: 1px solid grey;
  }
  .tree {
    margin-top: 1em;
  }
  .tree > :global(div.tv_node) {
    padding-left: 0 !important;
  }
</style>
