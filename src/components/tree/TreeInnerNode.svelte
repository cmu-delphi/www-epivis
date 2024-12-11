<script lang="ts">
  import DataSet from '../../data/DataSet';
  import type { DataGroup } from '../../data/DataSet';
  import type { IChart } from '../../store';
  import { expandedDataGroups } from '../../store';
  import TreeLeafNode from './TreeLeafNode.svelte';
  import Fa from 'svelte-fa';
  import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';

  export let node: DataGroup;
  export let chart: IChart | null;

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
  <span
    on:click={toggleExpanded}
    role="button"
    tabindex="0"
    on:keydown={(e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (e.target != null) {
        e.target.click();
      }
    }}
  >
    <Fa icon={expanded ? faChevronDown : faChevronRight} style="width: 0.9em; margin-right: 0.5em" />
    <span>
      {node.title}
    </span>
  </span>
  {#if expanded}
    {#each node.datasets as child (child.title)}
      {#if child instanceof DataSet}
        <TreeLeafNode {chart} node={child} />
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
    display: flex;
    align-items: center;
  }
</style>
