<script lang="ts">
  import { importWiki } from '../../../api/EpiData';
  import { wikiArticles } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  const languages = [
    {
      value: 'en',
      label: 'English',
    },
  ];

  export function importDataSet() {
    return importWiki({
      articles: $formSelections.wiki.articles,
      resolution: $formSelections.wiki.resolution,
      hour: $formSelections.wiki.useHour ? $formSelections.wiki.hour : null,
      language: $formSelections.wiki.language,
    });
  }
</script>

<SelectField id="{id}-r" label="Article" bind:value={$formSelections.wiki.articles} options={wikiArticles} />
<div>
  <div class="uk-form-label">Temporal Resolution</div>
  <div class="uk-form-controls uk-form-controls-text">
    <label
      ><input
        class="uk-radio"
        type="radio"
        name="resolution"
        value="daily"
        bind:group={$formSelections.wiki.resolution}
      /> Daily</label
    >
    <label
      ><input
        class="uk-radio"
        type="radio"
        name="resolution"
        value="weekly"
        bind:group={$formSelections.wiki.resolution}
      /> Weekly</label
    >
  </div>
</div>
<div>
  <div class="uk-form-label">
    <label
      ><input type="checkbox" class="uk-checkbox" bind:checked={$formSelections.wiki.useHour} /> Specific Hour (filter by
      hour else return sum: 0-23, timezone is UTC)</label
    >
  </div>
  <div class="uk-form-controls">
    <input
      class="uk-input"
      type="number"
      min="0"
      max="23"
      name="hour"
      required
      bind:value={$formSelections.wiki.hour}
      disabled={!$formSelections.wiki.useHour}
    />
  </div>
</div>
<SelectField
  id="{id}-lang"
  name="language"
  label="Language"
  bind:value={$formSelections.wiki.language}
  options={languages}
/>
