<script lang="ts">
  import {
    faAnchor,
    faArrowsAlt,
    faChartLine,
    faCrop,
    faEllipsisH,
    faExpand,
    faImage,
    faLink,
    faPaintBrush,
    faReceipt,
    faSearchPlus,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { activeDatasets, isShowingPoints, navMode, randomizeColors, reset, scaleMean } from '../store';
  import type { IChart } from '../store';
  import { NavMode } from './chartUtils';
  import RegressionDialog from './dialogs/RegressionDialog.svelte';
  import DirectLinkDialog from './dialogs/DirectLinkDialog.svelte';

  export let chart: IChart | null;

  export let style = '';

  function takeScreenshot() {
    if (!chart) {
      return;
    }
    const png = chart.getCanvas().toDataURL('image/png');
    const a = document.createElement('a');
    a.href = png;
    a.download = 'EpiVis.png';
    chart.getCanvas().parentElement!.appendChild(a);
    a.click();
    a.remove();
  }

  let doDialog: 'regress' | null | 'directLink' = null;

  function closeDialog() {
    doDialog = null;
  }
</script>

<div class="menu" {style}>
  <div class="uk-button-group">
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      on:click|preventDefault={randomizeColors}
      title="Randomize Colors"
      uk-tooltip><Fa icon={faPaintBrush} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      disabled={!chart}
      on:click|preventDefault={() => (chart ? chart.fitData(true) : null)}
      title="Fit data to screen"
      uk-tooltip><Fa icon={faExpand} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      class:uk-active={$isShowingPoints}
      on:click|preventDefault={() => ($isShowingPoints = !$isShowingPoints)}
      title="Show or Hide points"
      uk-tooltip><Fa icon={faEllipsisH} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      on:click|preventDefault={scaleMean}
      title="Scale by 1/mean"
      uk-tooltip><Fa icon={faAnchor} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      on:click|preventDefault={() => (doDialog = 'regress')}
      title="Perform Regression"
      uk-tootlip
      disabled={$activeDatasets.length < 2}><Fa icon={faChartLine} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      on:click|preventDefault={reset}
      title="Reset DataSet Scaling"
      uk-tooltip><Fa icon={faReceipt} /></button
    >
  </div>
  <div class="uk-button-group">
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      disabled={!chart}
      title="Take a screenshot"
      uk-title
      on:click|preventDefault={takeScreenshot}><Fa icon={faImage} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      title="Link to this view"
      disabled={!chart}
      uk-title
      on:click|preventDefault={() => (doDialog = 'directLink')}><Fa icon={faLink} /></button
    >
  </div>
  <div class="uk-button-group">
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      class:uk-active={$navMode === NavMode.pan}
      title="Pan Mode"
      uk-tooltip
      on:click|preventDefault={() => ($navMode = NavMode.pan)}><Fa icon={faArrowsAlt} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      class:uk-active={$navMode === NavMode.crop}
      title="Crop Mode"
      uk-tooltip
      on:click|preventDefault={() => ($navMode = NavMode.crop)}><Fa icon={faCrop} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      class:uk-active={$navMode === NavMode.zoom}
      title="Zoom Mode"
      uk-tooltip
      on:click|preventDefault={() => ($navMode = NavMode.zoom)}><Fa icon={faSearchPlus} /></button
    >
  </div>
</div>

{#if doDialog === 'regress'}
  <RegressionDialog on:close={closeDialog} />
{:else if doDialog === 'directLink'}
  <DirectLinkDialog {chart} on:close={closeDialog} />
{/if}

<style>
  .menu {
    display: flex;
    justify-content: center;
    padding: 0.5em 1em 0.5em 0.5em;
    border-bottom: 1px solid grey;
  }
  .uk-button-group {
    margin: 0 1em;
  }
</style>
