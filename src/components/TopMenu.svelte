<script lang="ts">
  import {
    faArrowsAlt,
    faChartLine,
    faCrop,
    faEllipsisH,
    faExpand,
    faImage,
    faMinimize,
    faLink,
    faPaintBrush,
    faQuestion,
    faSearchPlus,
    faShuffle,
    faUpDown,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { activeDatasets, isShowingPoints, navMode, randomizeColors, reset, scaleMean } from '../store';
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
      case 'a':
        $navMode = NavMode.autofit;
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
      case 'h':
        tour.cancel();
        tour.start();
        break;
    }
  }
</script>

<div class="menu" {style} data-tour="top">
  <div class="uk-button-group" data-tour="navmode">
    <button
      type="button"
      class="uk-button uk-button-small"
      disabled={!chart}
      class:uk-active={$navMode === NavMode.autofit}
      class:uk-button-secondary={$navMode === NavMode.autofit}
      class:uk-button-default={$navMode !== NavMode.autofit}
      on:click|preventDefault={() => ($navMode = NavMode.autofit)}
      title="Autofit Mode<br/>(Keyboard Shortcut: a)"
      uk-tooltip><Fa icon={faUpDown} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-small"
      class:uk-active={$navMode === NavMode.pan}
      title="Pan Mode<br/>(Keyboard Shortcut: p)"
      class:uk-button-secondary={$navMode === NavMode.pan}
      class:uk-button-default={$navMode !== NavMode.pan}
      uk-tooltip
      on:click|preventDefault={() => ($navMode = NavMode.pan)}><Fa icon={faArrowsAlt} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-small"
      class:uk-active={$navMode === NavMode.crop}
      class:uk-button-secondary={$navMode === NavMode.crop}
      class:uk-button-default={$navMode !== NavMode.crop}
      title="Crop Mode<br/>(Keyboard Shortcut: c)"
      uk-tooltip
      on:click|preventDefault={() => ($navMode = NavMode.crop)}><Fa icon={faCrop} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-small"
      class:uk-active={$navMode === NavMode.zoom}
      class:uk-button-secondary={$navMode === NavMode.zoom}
      class:uk-button-default={$navMode !== NavMode.zoom}
      title="Zoom Mode<br/>(Keyboard Shortcut: z)"
      uk-tooltip
      on:click|preventDefault={() => ($navMode = NavMode.zoom)}><Fa icon={faSearchPlus} /></button
    >
  </div>
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
      class="uk-button uk-button-small"
      class:uk-active={$isShowingPoints}
      class:uk-button-secondary={$isShowingPoints}
      class:uk-button-default={!$isShowingPoints}
      on:click|preventDefault={() => ($isShowingPoints = !$isShowingPoints)}
      title="Show or Hide Points<br/>(Keyboard Shortcut: s)"
      data-tour="points"
      uk-tooltip><Fa icon={faEllipsisH} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      on:click|preventDefault={() => (doDialog = 'regress')}
      title="Perform Regression"
      uk-tooltip
      disabled={$activeDatasets.length < 2}><Fa icon={faChartLine} /></button
    >
  </div>
  <div class="uk-button-group" data-tour="scale">
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      on:click|preventDefault={scaleMean}
      title="Scale by 1/mean"
      uk-tooltip><Fa icon={faMinimize} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      on:click|preventDefault={reset}
      title="Reset Dataset Scaling"
      uk-tooltip><Fa icon={faShuffle} /></button
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
  <div class="uk-button-group">
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      disabled={!chart}
      title="View introductory tour<br/>(Keyboard Shortcut: h)"
      uk-tooltip
      data-tour="datatour"
      on:click|preventDefault={() => {
        tour.cancel();
        tour.start();
      }}><Fa icon={faQuestion} /></button
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
