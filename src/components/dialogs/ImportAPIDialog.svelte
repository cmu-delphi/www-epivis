<script lang="ts">
  // import { createEventDispatcher } from 'svelte';

  import Dialog from './Dialog.svelte';
  import { randomId } from '../utils';

  // const dispatch = createEventDispatcher();

  const id = randomId();
</script>

<Dialog title="Load from EpiData API" on:close>
  <button slot="footer" class="uk-button" type="button" form={id}>Import Dataset</button>
</Dialog>
