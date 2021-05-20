<script lang="ts">
  import {
    faAnchor,
    faArrowsAlt,
    faChartLine,
    faCrop,
    faEllipsisH,
    faExpand,
    faExternalLinkSquareAlt,
    faLink,
    faPaintBrush,
    faPizzaSlice,
    faReceipt,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import UIkit from 'uikit';
  import { getDirectLink, navMode } from '../store';
  import { NavMode } from './Chart';

  function showDirectLink() {
    const r = getDirectLink();
    const code = `
    ${r.anySkipped ? `<div class="uk-alert uk-alert-warning">Some datasets could not be linked</div>` : ''}
    <input class="uk-input" value="${r.url.href}" readonly />
    `;
    UIkit.modal.alert(code);
  }
</script>

<div class="menu">
  <div class="uk-divider" />

  <button type="button" class="uk-button uk-button-default uk-button-small" id="file_fullscreen" style="display: none;">
    <Fa icon={faExternalLinkSquareAlt} />
  </button>
  <div class="uk-button-group">
    <button type="button" class="uk-button uk-button-default uk-button-small" id="action_randomize"
      ><Fa icon={faPaintBrush} /></button
    >
    <button type="button" class="uk-button uk-button-default uk-button-small" id="action_autoscale"
      ><Fa icon={faArrowsAlt} /></button
    >
    <button type="button" class="uk-button uk-button-default uk-button-small" id="action_showpoints"
      ><Fa icon={faEllipsisH} /></button
    >
    <button type="button" class="uk-button uk-button-default uk-button-small" id="action_multiscale"
      ><Fa icon={faAnchor} /></button
    >
    <button type="button" class="uk-button uk-button-default uk-button-small" id="action_regress"
      ><Fa icon={faChartLine} /></button
    >
    <button type="button" class="uk-button uk-button-default uk-button-small" id="action_reset"
      ><Fa icon={faReceipt} /></button
    >
    <button type="button" class="uk-button uk-button-default uk-button-small" id="action_screenshot"
      ><Fa icon={faPizzaSlice} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      id="action_directlink"
      on:click|preventDefault={showDirectLink}><Fa icon={faLink} /></button
    >
  </div>

  <div class="uk-divider" />

  <div class="uk-button-group">
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      class:uk-active={$navMode === NavMode.pan}
      on:click|preventDefault={() => ($navMode = NavMode.pan)}><Fa icon={faArrowsAlt} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      class:uk-active={$navMode === NavMode.crop}
      on:click|preventDefault={() => ($navMode = NavMode.crop)}><Fa icon={faCrop} /></button
    >
    <button
      type="button"
      class="uk-button uk-button-default uk-button-small"
      class:uk-active={$navMode === NavMode.zoom}
      on:click|preventDefault={() => ($navMode = NavMode.zoom)}><Fa icon={faExpand} /></button
    >
  </div>
</div>

<style>
  .menu {
    grid-area: menu;
    display: flex;
    justify-content: center;
  }
</style>
