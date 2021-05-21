<script lang="ts">
  import { importTwitter } from '../../../api/EpiData';
  import { twitterLocations as regions } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';

  export let id: string;

  let locations = regions[0].value;
  let auth = '';
  let resolution: 'daily' | 'weekly' = 'daily';

  export function importDataSet() {
    return importTwitter({ auth, locations, resolution });
  }
</script>

<TextField id="{id}-auth" name="auth" label="Authorizaton Token" bind:value={auth} placeholder="authorization token" />
<SelectField id="{id}-r" label="Location" bind:value={locations} options={regions} />
<div>
  <div class="uk-form-label">Temporal Resolution</div>
  <div class="uk-form-controls uk-form-controls-text">
    <label><input class="uk-radio" type="radio" name="resolution" value="daily" bind:group={resolution} /> Daily</label>
    <label
      ><input class="uk-radio" type="radio" name="resolution" value="weekly" bind:group={resolution} /> Weekly</label
    >
  </div>
</div>
