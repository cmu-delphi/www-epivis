<script lang="ts">
  import { wikiArticles } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';


  export let id: string;

  let article = wikiArticles[0].value;
  let resolution: 'daily' | 'weekly' = 'daily';
  let hour = 0;
  let useHour = false;
</script>

<SelectField id="{id}-r" label="Article" bind:value={article} options={wikiArticles} />
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
<div>
  <div class="uk-form-label"><label><input type="checkbox" class="uk-checkbox" bind:checked={useHour}/>Specific Hour (filter by hour else return sum: 0-23, timezone is UTC)</label></div>
  <div class="uk-form-controls">
    <input class="uk-input" type="number" min="0" max="23" name="hour" bind:value={hour} disabled={!useHour} />
  </div>
</div>
