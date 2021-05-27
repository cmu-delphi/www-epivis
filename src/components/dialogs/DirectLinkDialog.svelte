<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  import Dialog from './Dialog.svelte';
  import { randomId } from './utils';
  import type { IChart } from '../../store';
  import { getDirectLink } from '../../store';

  const dispatch = createEventDispatcher();

  export let chart: IChart | null;
  const id = randomId();

  $: link = chart ? getDirectLink(chart) : null;

  function onSubmit(e: Event) {
    e.preventDefault();
    dispatch('close');
  }

  let area: HTMLTextAreaElement | null = null;

  onMount(() => {
    setTimeout(() => {
      if (area) {
        area.select();
      }
    }, 100);
  });
</script>

<Dialog title="Share Link" on:close>
  <form class="uk-form-stacked" {id} on:submit={onSubmit}>
    {#if link && link.anySkipped}
      <div class="uk-alert uk-alert-warning">Some datasets could not be linked</div>
    {/if}
    <div>
      <label class="uk-form-label" for="{id}-f">Link to Share</label>
      <div class="uk-form-controls">
        <textarea bind:this={area} class="uk-textarea" readonly rows="10" value={link ? link.url.href : ''} />
      </div>
    </div>
  </form>

  <button slot="footer" class="uk-button uk-button-primary" type="submit" form={id}>Close</button>
</Dialog>
