<script lang="ts">
  import { currentDate, currentEpiWeek, epiRange, loadDataSet } from '../../../api/EpiData';

  import { firstDate, firstEpiWeek, wikiArticles } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';

  export let id: string;

  let articles = wikiArticles[0].value;
  let resolution: 'daily' | 'weekly' = 'daily';
  let hour = 0;
  let useHour = false;
  let language = 'en';

  const languages = [
    {
      value: 'en',
      label: 'English',
    },
  ];

  export function importDataSet() {
    const articleLabel = wikiArticles.find((d) => d.value === articles)?.label ?? '?';
    let title = `[API] Wiki: ${articleLabel}, ${resolution[0].toUpperCase()}${resolution.slice(1)}`;
    if (useHour) {
      title += ` (${hour})`;
    }
    return loadDataSet(
      title,
      'wiki',
      resolution === 'daily'
        ? {
            dates: epiRange(firstDate.wiki, currentDate),
          }
        : {
            epiweeks: epiRange(firstEpiWeek.wiki, currentEpiWeek),
          },
      {
        articles,
        language,
        hour: useHour ? hour : null,
      },
      ['count', 'total', 'value'],
    );
  }
</script>

<SelectField id="{id}-r" label="Article" bind:value={articles} options={wikiArticles} />
<div>
  <div class="uk-form-label">Temporal Resolution</div>
  <div class="uk-form-controls uk-form-controls-text">
    <label><input class="uk-radio" type="radio" name="resolution" value="daily" bind:group={resolution} /> Daily</label>
    <label
      ><input class="uk-radio" type="radio" name="resolution" value="weekly" bind:group={resolution} /> Weekly</label
    >
  </div>
</div>
<div>
  <div class="uk-form-label">
    <label
      ><input type="checkbox" class="uk-checkbox" bind:checked={useHour} /> Specific Hour (filter by hour else return sum:
      0-23, timezone is UTC)</label
    >
  </div>
  <div class="uk-form-controls">
    <input class="uk-input" type="number" min="0" max="23" name="hour" required bind:value={hour} disabled={!useHour} />
  </div>
</div>
<SelectField id="{id}-lang" name="language" label="Language" bind:value={language} options={languages} />
