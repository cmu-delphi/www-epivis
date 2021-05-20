<script lang="ts">
  import {
    faAnchor,
    faArrowsAlt,
    faChartLine,
    faCrop,
    faEllipsisH,
    faExpand,
    faExpandArrowsAlt,
    faExternalLinkSquareAlt,
    faImage,
    faLink,
    faPaintBrush,
    faReceipt,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import UIkit from 'uikit';
  import { getDirectLink, isShowingPoints, navMode, randomizeColors, reset, scaleMean } from '../store';
  import type { IChart } from '../store';
  import { NavMode } from './chartUtils';

  export let chart: IChart | null;

  export let style = '';

  function showDirectLink() {
    if (!chart) {
      return;
    }
    const r = getDirectLink(chart);
    const code = `
    ${r.anySkipped ? `<div class="uk-alert uk-alert-warning">Some datasets could not be linked</div>` : ''}
    <input class="uk-input" value="${r.url.href}" readonly />
    `;
    UIkit.modal.alert(code);
  }
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
</script>

<div class="menu" {style}>
  <button type="button" class="uk-button uk-button-default uk-button-small" id="file_fullscreen" style="display: none;">
    <Fa icon={faExternalLinkSquareAlt} />
  </button>
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
      on:click|preventDefault={() => (chart ? chart.fitData() : null)}
      title="Fit data to screen"
      uk-tooltip><Fa icon={faExpandArrowsAlt} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      class:uk-active={$isShowingPoints}
      on:click|preventDefault={() => ($isShowingPoints = !$isShowingPoints)}
      title="Show or Hide points"
      uk-tooltip><Fa icon={faEllipsisH} /></button
    >
    <button type="button" class="uk-button uk-button-default uk-button-small" on:click|preventDefault={scaleMean}
      ><Fa icon={faAnchor} /></button
    >
    <button type="button" class="uk-button uk-button-default uk-button-small" id="action_regress"
      ><Fa icon={faChartLine} /></button
    >
    <button type="button" class="uk-button uk-button-default uk-button-small" on:click|preventDefault={reset}
      ><Fa icon={faReceipt} /></button
    >
  </div>
  <div class="uk-divider" />
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
      on:click|preventDefault={showDirectLink}><Fa icon={faLink} /></button
    >
  </div>

  <div class="uk-divider" />

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
      on:click|preventDefault={() => ($navMode = NavMode.zoom)}><Fa icon={faExpand} /></button
    >
  </div>
</div>

<style>
  .menu {
    display: flex;
    justify-content: center;
  }
</style>
