<script lang="ts">
  import { faCode, faDatabase, faFolderOpen, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import type { default as DataSet, DataGroup } from '../data/DataSet';
  import AddLineDialog from './dialogs/AddLineDialog.svelte';
  import AddKernelDialog from './dialogs/AddKernelDialog.svelte';
  import ImportApiDialog from './dialogs/ImportAPIDialog.svelte';
  import ImportCsvDialog from './dialogs/ImportCSVDialog.svelte';
  import { addDataSet } from '../store';

  let doDialog: null | 'csv' | 'api' | 'addLine' | 'addKernel' = null;

  function importedDataset(e: CustomEvent) {
    addDataSet(e.detail as DataSet | DataGroup);
    doDialog = null;
  }
  function closeDialog() {
    doDialog = null;
  }
</script>

<div class="uk-button-group">
  <button
    type="button"
    class="uk-button uk-button-default uk-button-small"
    title="Import dataset from a local CSV File"
    uk-tooltip
    on:click|preventDefault={() => (doDialog = 'csv')}><Fa icon={faFolderOpen} /></button
  >
  <button
    type="button"
    class="uk-button uk-button-default uk-button-small"
    title="Import dataset from Delphi API"
    uk-tooltip
    on:click|preventDefault={() => (doDialog = 'api')}><Fa icon={faDatabase} /></button
  >
  <button
    type="button"
    class="uk-button uk-button-default uk-button-small"
    title="Add a line manually"
    uk-tooltip
    on:click|preventDefault={() => (doDialog = 'addLine')}><Fa icon={faPencilAlt} /></button
  >
  <button
    type="button"
    class="uk-button uk-button-default uk-button-small"
    title="Create dataset via kernel function"
    uk-tooltip
    on:click|preventDefault={() => (doDialog = 'addKernel')}><Fa icon={faCode} /></button
  >
</div>

{#if doDialog === 'csv'}
  <ImportCsvDialog on:imported={importedDataset} on:close={closeDialog} />
{:else if doDialog === 'api'}
  <ImportApiDialog on:imported={importedDataset} on:close={closeDialog} />
{:else if doDialog === 'addLine'}
  <AddLineDialog on:imported={importedDataset} on:close={closeDialog} />
{:else if doDialog === 'addKernel'}
  <AddKernelDialog on:imported={importedDataset} on:close={closeDialog} />
{/if}
