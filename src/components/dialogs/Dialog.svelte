<script lang="ts">
  import UIkit from 'uikit';
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let title = '';

  let root: HTMLElement | null;

  onMount(() => {
    UIkit.modal(root!).show();
    (UIkit.util as any).on(root, 'hidden', () => {
      dispatch('close');
    });
  });
</script>

<div bind:this={root} uk-modal>
  <div class="uk-modal-dialog">
    <button class="uk-modal-close-default" type="button" uk-close />
    <div class="uk-modal-header">
      <h2 class="uk-modal-title">{title}</h2>
    </div>
    <div class="uk-modal-body">
      <slot />
    </div>
    <div class="uk-modal-footer">
      <slot name="footer" />
    </div>
  </div>
</div>


<style>
  .uk-modal-body :global(form > div) {
    margin: 1em 0;
  }

  .uk-modal-body :global(.uk-form-label) {
    font-weight: 700;
  }
  .uk-modal-body :global(.uk-form-controls > label) {
    display: block;
  }
</style>