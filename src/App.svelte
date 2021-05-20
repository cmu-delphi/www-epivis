<script lang="ts">
  import TopMenu from './components/TopMenu.svelte';
  import TreeInnerNode from './components/TreeInnerNode.svelte';
  import { datasetTree } from './store';
</script>

<TopMenu />
<side class="tree" style="grid-area: side">
  <TreeInnerNode node={$datasetTree} />
</side>
<main style="grid-area: main">CANVAS</main>

<style>
  .tree {
    padding: 0.5em 1em 0.5em 0.5em;
    border-right: 1px solid grey;
  }
</style>
