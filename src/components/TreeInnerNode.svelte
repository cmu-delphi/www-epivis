<script lang="ts">
  import DataSet from '../data/DataSet';
  import type { DataGroup } from '../data/DataSet';
  import { expandedDataGroups } from '../store';
  import TreeLeafNode from './TreeLeafNode.svelte';
  import Fa from 'svelte-fa';
  import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';

  export let node: DataGroup;

  function toggleExpanded() {
    if (expanded) {
      $expandedDataGroups = $expandedDataGroups.filter((d) => d !== node);
    } else {
      $expandedDataGroups = [node, ...$expandedDataGroups];
    }
  }
  $: expanded = $expandedDataGroups.includes(node);
</script>

<div class="tv_node">
  <span on:click={toggleExpanded}>
    <Fa icon={expanded ? faChevronDown : faChevronRight} style="width: 1em" />
    {node.title}
  </span>
  {#if expanded}
    {#each node.datasets as child (child.title)}
      {#if child instanceof DataSet}
        <TreeLeafNode node={child} />
      {:else}
        <svelte:self node={child} />
      {/if}
    {/each}
  {/if}
</div>

<style>
  div.tv_node {
    padding-left: 1em;
  }
  div.tv_node > span {
    cursor: pointer;
  }
</style>
