<script lang="ts">
  import DataSet from '../../data/DataSet';
  import type { DataGroup } from '../../data/DataSet';
  import type { IChart } from '../../store';
  import { expandedDataGroups } from '../../store';
  import TreeLeafNode from './TreeLeafNode.svelte';
  import Fa from 'svelte-fa';
  import { faChevronRight, faChevronDown, faInfoCircle, faBan } from '@fortawesome/free-solid-svg-icons';

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
  <span on:click={toggleExpanded}>
    <Fa icon={expanded ? faChevronDown : faChevronRight} style="width: 0.9em; margin-right: 0.5em" />
    <span>
      {node.displayTitle()}
    </span>
    {#if node.dataSourceDocumentationUrl}
      <a
        class="info-icon"
        href={node.dataSourceDocumentationUrl}
        target="_blank"
        on:click|stopPropagation
        title={node.dataSourceDescription}
        uk-tooltip="pos: bottom-right"
      >
        <Fa icon={faInfoCircle} style="width: 0.9em; margin-right: 0.5em" />
      </a>
    {/if}
  </span>

  {#if expanded}
    {#each node.datasets as child (child.displayTitle())}
      {#if child instanceof DataSet}
        <TreeLeafNode {chart} node={child} />
      {:else}
        <svelte:self node={child} />
      {/if}
    {/each}
    {#each node.missingSeriesKeyValues as label (label)}
      <div class="tv_node_missing" title="No data available" uk-tooltip="pos: right">
        <Fa icon={faBan} style="width: 1em; margin-right: 0.5em" />
        <span>
          {label}
        </span>
      </div>
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
  div.tv_node_missing {
    padding-left: 1em;
    display: flex;
    align-items: center;
    opacity: 0.5;
  }
</style>
