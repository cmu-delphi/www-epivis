<script lang="ts">
  import DataSet from '../data/DataSet';
  import type { IChart } from '../store';
  import { datasetTree, version } from '../store';
  import ImportDataSetsMenu from './ImportDataSetsMenu.svelte';
  import TreeInnerNode from './tree/TreeInnerNode.svelte';
  import TreeLeafNode from './tree/TreeLeafNode.svelte';

  export let style = '';
  export let chart: IChart | null;
</script>

<side class="left" {style} data-tour="browser">
  <ImportDataSetsMenu />
  <div class="tree">
    {#each $datasetTree.datasets as child (child.displayTitle())}
      {#if child instanceof DataSet}
        <TreeLeafNode {chart} node={child} />
      {:else}
        <TreeInnerNode {chart} node={child} />
      {/if}
    {/each}
  </div>
  <div class="credits">
    <a href="https://github.com/cmu-delphi/www-epivis/releases/v{version}">EpiVis v{version}</a> &copy; {new Date().getFullYear()},
    Delphi Group<br />
    <a href="https://github.com/cmu-delphi/www-epivis/">Source Code</a> under
    <a href="https://github.com/cmu-delphi/www-epivis/blob/main/LICENSE">MIT license</a><br />
  </div>
</side>

<style>
  .left {
    padding: 0.5em 1em 0.5em 0.5em;
    border-right: 1px solid grey;
    display: flex;
    flex-direction: column;
    max-width: 20em;
  }
  .tree {
    margin-top: 1em;
    flex: 1 1 0;
  }
  .tree > :global(div.tv_node) {
    padding-left: 0 !important;
  }
  .credits {
    font-size: 0.75rem;
  }
</style>
