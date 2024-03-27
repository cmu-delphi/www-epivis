<script lang="ts">
  import {
    faAnchor,
    faArrowsAlt,
    faChartLine,
    faCog,
    faCrop,
    faEllipsisH,
    faExpand,
    faImage,
    faLink,
    faPaintBrush,
    faQuestion,
    faReceipt,
    faSearchPlus,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { activeDatasets, isShowingPoints, navMode, randomizeColors, reset, scaleMean, autoFit } from '../store';
  import type { IChart } from '../store';
  import { NavMode } from './chartUtils';
  import { tour } from '../tour';
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

  function keyPress(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    switch (e.key) {
      case 'f':
        if (chart) {
          chart.fitData(true);
        }
        break;
      case 'p':
        $navMode = NavMode.pan;
        break;
      case 'z':
        $navMode = NavMode.zoom;
        break;
      case 'c':
        $navMode = NavMode.crop;
        break;
      case 'r':
        randomizeColors();
        break;
      case 's':
        $isShowingPoints = !$isShowingPoints;
        break;
      case 'a':
        $autoFit = !$autoFit;
        break;
    }
  }
</script>

<div class="menu" {style} data-tour="top">
  <div class="uk-button-group">
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      on:click|preventDefault={randomizeColors}
      title="Randomize Colors<br/>(Keyboard Shortcut: r)"
      data-tour="random"
      uk-tooltip><Fa icon={faPaintBrush} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      disabled={!chart}
      on:click|preventDefault={() => (chart ? chart.fitData(true) : null)}
      title="Fit Data to Screen<br/>(Keyboard Shortcut: f)"
      data-tour="fit"
      uk-tooltip><Fa icon={faExpand} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      disabled={!chart}
      class:uk-active={$autoFit === true}
      on:click|preventDefault={() => ($autoFit = !$autoFit)}
      title="Automatically Fit Data<br/>(Keyboard Shortcut: a)"
      data-tour="autofit"
      uk-tooltip><Fa icon={faCog} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      class:uk-active={$isShowingPoints}
      on:click|preventDefault={() => ($isShowingPoints = !$isShowingPoints)}
      title="Show or Hide points<br/>(Keyboard Shortcut: s)"
      data-tour="points"
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
      uk-tooltip
      data-tour="screenshot"
      on:click|preventDefault={takeScreenshot}><Fa icon={faImage} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      title="Link to this view"
      disabled={!chart}
      uk-tooltip
      data-tour="link"
      on:click|preventDefault={() => (doDialog = 'directLink')}><Fa icon={faLink} /></button
    >
  </div>
  <div class="uk-button-group" data-tour="navmode">
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      class:uk-active={$navMode === NavMode.pan}
      title="Pan Mode<br/>(Keyboard Shortcut: p)"
      uk-tooltip
      on:click|preventDefault={() => ($navMode = NavMode.pan)}><Fa icon={faArrowsAlt} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      class:uk-active={$navMode === NavMode.crop}
      title="Crop Mode<br/>(Keyboard Shortcut: c)"
      uk-tooltip
      on:click|preventDefault={() => ($navMode = NavMode.crop)}><Fa icon={faCrop} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      class:uk-active={$navMode === NavMode.zoom}
      title="Zoom Mode<br/>(Keyboard Shortcut: z)"
      uk-tooltip
      on:click|preventDefault={() => ($navMode = NavMode.zoom)}><Fa icon={faSearchPlus} /></button
    >
  </div>
  <div class="uk-button-group">
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      disabled={!chart}
      title="View introductory tour"
      uk-tooltip
      data-tour="datatour"
      on:click|preventDefault={() => tour.start()}><Fa icon={faQuestion} /></button
    >
  </div>
</div>

{#if doDialog === 'regress'}
  <RegressionDialog on:close={closeDialog} />
{:else if doDialog === 'directLink'}
  <DirectLinkDialog {chart} on:close={closeDialog} />
{/if}

<svelte:window on:keypress={keyPress} />

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
