<script lang="ts">
  import { twitterLocations } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
import TextField from '../inputs/TextField.svelte';

  export let id: string;

  let location = twitterLocations[0].value;
  let auth = '';
  let resolution: 'daily' | 'weekly' = 'daily';
</script>

<TextField id="{id}-auth" label="Authorizaton Token" bind:value={auth} placeholder="authorization token" />
<SelectField id="{id}-r" label="Location" bind:value={location} options={twitterLocations} />
<div>
  <div class="uk-form-label">Temporal Resolution</div>
  <div class="uk-form-controls uk-form-controls-text">
    <label
      ><input class="uk-radio" type="radio" name="resolution" value="daily" bind:group={resolution} />Daily</label
    >
    <label
      ><input class="uk-radio" type="radio" name="resolution" value="weekly" bind:group={resolution} />Weekly</label
    >
  </div>
</div>
