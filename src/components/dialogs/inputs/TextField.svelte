<script lang="ts">
  export let label: string;
  export let id: string;
  export let name: string;
  export let value: string;
  export let placeholder = '';
  export let required = true;
</script>

<div>
  <label class="uk-form-label" for={id}>{label}</label>
  <div class="uk-form-controls">
    <input type="text" class="uk-input" {name} {required} {id} bind:value {placeholder} />
  </div>
</div>
