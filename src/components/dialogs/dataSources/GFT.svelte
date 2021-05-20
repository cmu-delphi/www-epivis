<script lang="ts">
  import { gftLocations } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';

  export let id: string;

  let location = gftLocations[0].value;
</script>

<SelectField id="{id}-r" label="Location" bind:value={location} options={gftLocations} />
