<script lang="ts">
  import TreeInnerNode from './components/TreeInnerNode.svelte';
  import { datasetTree } from './store';
</script>

<div class="root">
  <side class="tree">
    <TreeInnerNode node={$datasetTree} />
  </side>
  <main>CANVAS</main>
</div>

<style>
  .root {
    display: flex;
    flex-direction: row;
    flex: 1 1 0;
  }
  .tree {
    padding: 0.5em 1em 0.5em 0.5em;
    border-right: 1px solid grey;
  }
  main {
    flex: 1 1 0;
  }
</style>
