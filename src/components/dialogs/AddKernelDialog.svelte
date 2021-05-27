<script lang="ts">
  import { activeDatasets } from '../../store';

  import { createEventDispatcher } from 'svelte';

  import Dialog from './Dialog.svelte';
  import { randomId } from './utils';
  import { mergeDataSets, scale, average, iliplus, product, ratio, sum } from '../../data/kernels';

  const dispatch = createEventDispatcher();

  $: datasets = $activeDatasets;
  const id = randomId();

  let name = 'Derived Dataset';
  let kernel: 'sum' | 'average' | 'product' | 'ratio' | 'scale' | 'iliplus' = 'sum';
  let selectedDatasets: string[] = ['0'];
  let scaleFactor = 1;

  function onSubmit(e: Event) {
    e.preventDefault();
    const ds =
      typeof selectedDatasets === 'string'
        ? [datasets[Number.parseInt(selectedDatasets, 10)]]
        : selectedDatasets.map((d) => datasets[Number.parseInt(d, 10)]);
    const funcs = {
      sum,
      scale: scale.bind(null, scaleFactor),
      product,
      average,
      ratio,
      iliplus,
    };
    const merged = mergeDataSets(name, ds, funcs[kernel]);
    if (merged) {
      dispatch('imported', merged);
    }
  }
</script>

<Dialog title="Create a new Dataset" on:close>
  <form class="uk-form-stacked" {id} on:submit={onSubmit}>
    <div>
      <label class="uk-form-label" for="{id}-n">Dataset Name</label>
      <div class="uk-form-controls">
        <input class="uk-input" type="text" required id="{id}-n" bind:value={name} />
      </div>
    </div>
    <div>
      <div class="uk-form-label">Kernel</div>
      <div class="uk-form-controls">
        <div class="uk-form-controls uk-form-controls-text">
          <label
            ><input class="uk-radio" type="radio" name="kernel" bind:group={kernel} value="sum" /> Sum of selected N datasets</label
          >
          <label
            ><input class="uk-radio" type="radio" name="kernel" bind:group={kernel} value="average" /> Average of selected
            N datasets</label
          >
          <label
            ><input class="uk-radio" type="radio" name="kernel" bind:group={kernel} value="product" /> Product of selected
            N datasets</label
          >
          <label
            ><input class="uk-radio" type="radio" name="kernel" bind:group={kernel} value="ratio" /> Calculates the quotient
            of the selected two datasets
          </label>
          <label
            ><input class="uk-radio" type="radio" name="kernel" bind:group={kernel} value="scale" /> Scales the selected
            dataset by a given factor</label
          >
          <label
            ><input class="uk-radio" type="radio" name="kernel" bind:group={kernel} value="iliplus" /> ILIplus (Calculates
            the product, divided by 100, of the selected two datasets. (Intended for 'wILI' and '%positive' datasets.)</label
          >
        </div>
      </div>
    </div>
    <div>
      <label class="uk-form-label" for="{id}-f">Regression Target</label>
      <div class="uk-form-controls">
        <select
          class="uk-select"
          required
          id="{id}-f"
          bind:value={selectedDatasets}
          multiple
          min={1}
          max={kernel === 'scale' ? 1 : kernel === 'ratio' || kernel === 'iliplus' ? 2 : undefined}
          rows="5"
        >
          {#each datasets as ds, i}
            <option value={i}>{ds.title}</option>
          {/each}
        </select>
      </div>
    </div>
    {#if kernel === 'scale'}
      <div>
        <label class="uk-form-label" for="{id}-s">Scale Factor</label>
        <div class="uk-form-controls">
          <input class="uk-input" type="number" id="{id}-s" bind:value={scaleFactor} />
        </div>
      </div>
    {/if}
  </form>
  <button slot="footer" class="uk-button uk-button-primary" type="submit" form={id}>Run Kernel</button>
</Dialog>
