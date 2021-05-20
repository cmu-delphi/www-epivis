<script lang="ts">
  import UIkit from 'uikit';
  import { onMount } from 'svelte';

  export let title = '';

  let root: HTMLElement | null;

  onMount(() => {
    UIkit.modal(root!).show();
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
