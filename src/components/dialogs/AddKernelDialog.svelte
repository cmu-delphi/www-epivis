<script lang="ts">
  // import { createEventDispatcher } from 'svelte';

  import Dialog from './Dialog.svelte';
  import { randomId } from '../utils';

  // const dispatch = createEventDispatcher();

  const id = randomId();
</script>

<Dialog title="Add Custom Line" on:close>
  <h1>Create a new Dataset</h1>
  <b>Select Inputs</b><br />
  In the tree to the left, select (by checking) the datasets to start with. How many you select depends on the function you
  want to apply.<br />
  <br />
  <b>Open the developer console</b><br />
  In chrome, the keyboard shortcut is Ctrl+Shift+J<br />
  <br />
  <b>Call the function <i>createDataset</i></b><br />
  The function accepts two parameters: a name for the output dataset, and a function to apply to the selected dataset(s).<br
  />
  <br />
  <b>Available Functions ("Kernels")</b><br />
  <i>Kernels.sum</i>, <i>Kernels.product</i>, <i>Kernels.average</i><br />
  Selected Datasets: 1 or more<br />
  Kernel Parameters: none<br />
  Action: Calculates the sum, product, or average of the selected datasets.<br />
  <br />
  <i>Kernels.iliplus</i><br />
  Selected Datasets: 2<br />
  Kernel Parameters: none<br />
  Action: Calculates the product, divided by 100, of the selected datasets. (Intended for 'wILI' and '%positive' datasets.)<br
  />
  <br />
  <i>Kernels.scale</i><br />
  Selected Datasets: 1<br />
  Kernel Parameters: <i>scale</i><br />
  Action: Scales the selected dataset by the provided <i>scale</i> parameter.<br />
  <br />
  <i>Kernels.ratio</i><br />
  Selected Datasets: 2<br />
  Kernel Parameters: <i>inverse</i> (optional)<br />
  Action: Calculates the quotient of the selected datasets. (Flips numerator and denominator if <i>inverse</i> is true.)<br
  />
  <br />
  <b>Examples</b><br />
  Compute ILI+: <i>createDataset('ILI+', Kernels.iliplus())</i><br />
  Scale GFT by 1/1000: <i>createDataset('GFT/1000', Kernels.scale(0.001))</i><br />
  Take the average: <i>createDataset('avg', Kernels.average())</i>
  <br />
  <button slot="footer" class="uk-button" type="button" form={id}>Draw Line</button>
</Dialog>
