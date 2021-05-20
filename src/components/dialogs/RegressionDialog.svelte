<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Dialog from './Dialog.svelte';
  import { randomId } from './utils';
  import { activeDatasets } from '../../store';

  const dispatch = createEventDispatcher();

  let dataset = '0';
  $: datasets = $activeDatasets;

  const id = randomId();
  function onSubmit(e: Event) {
    e.preventDefault();
    const ds = datasets[Number.parseInt(dataset, 10)];
    for (const d of datasets) {
      if (d !== ds) {
        d.regress(ds);
      }
    }
    $activeDatasets = datasets; // update to trigger updates
    dispatch('close');
  }
</script>

<Dialog title="Run regression" on:close>
  <form class="uk-form-stacked" {id} on:submit={onSubmit}>
    <div>
      <label class="uk-form-label" for="{id}-f">Regression Target</label>
      <div class="uk-form-controls">
        <select class="uk-select" required id="{id}-f" bind:value={dataset}>
          {#each datasets as ds, i}
            <option value={i}>{ds.title}</option>
          {/each}
        </select>
      </div>
    </div>
  </form>

  <button slot="footer" class="uk-button uk-button-primary" type="submit" form={id}>Run Regression</button>
</Dialog>
