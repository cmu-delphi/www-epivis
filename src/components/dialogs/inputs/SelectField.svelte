<script lang="ts">
  import Fa from 'svelte-fa';
  import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

  export let label: string;
  export let id: string;
  export let name = 'location';
  export let value: string;
  export let options: ({ value: String; label: string } | string)[] = [];
  export let additionalInfo: string = '';
</script>

<div>
  <label class="uk-form-label" for={id}
    >{label}
    {#if additionalInfo}
      <span title={additionalInfo} uk-tooltip="pos: bottom-right">
        <Fa icon={faCircleQuestion} style="width: 0.9em; margin-right: 0.5em;" />
      </span>
    {/if}
  </label>
  <div class="uk-form-controls">
    <select class="uk-select" required {name} {id} bind:value>
      <option value="" />
      {#each options as o}
        <option value={typeof o === 'string' ? o : o.value}>{typeof o === 'string' ? o : o.label}</option>
      {/each}
    </select>
  </div>
</div>
