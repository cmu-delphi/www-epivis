<script lang="ts">
  export let label: string;
  export let id: string;
  export let name = 'location';
  export let value: string;
  export let options: ({ value: String; label: string } | string)[] = [];
</script>

<div>
  <label class="uk-form-label" for={id}>{label}</label>
  <div class="uk-form-controls">
    <select class="uk-select" required {name} {id} bind:value>
      <option value="" />
      {#each options as o}
        <option value={typeof o === 'string' ? o : o.value}>{typeof o === 'string' ? o : o.label}</option>
      {/each}
    </select>
  </div>
</div>
