<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Dialog from './Dialog.svelte';
  import { randomId } from '../utils';
import EpiDate from '../../data/EpiDate';
import DataSet from '../../data/DataSet';
import EpiPoint from '../../data/EpiPoint';

  const dispatch = createEventDispatcher();

  const id = randomId();

  let name = 'My Line';
  let startDate = '2014-01-01';


  let endDate = '2015-01-01';
  let startValue = 0;
  let endValue = 1;

  function parseDate(date: string) {
    if (date.length === 6) {
      const d = Number.parseInt(date, 10);
      if (!Number.isNaN(d)) {
        return EpiDate.fromEpiweek(Math.floor(d / 100), d % 100);
      }
    } else {
      try {
        return EpiDate.parse(date);
      } catch (ex) {
        return null;
      }
    }
    return null;
  }

  function onSubmit(e: Event) {
    e.preventDefault();
    const x0 = parseDate(startDate);

    const x1 = endDate ? parseDate(endDate) : x0;
    if (!x0 || !x1) {
      return;
    }
    const v0 = typeof startValue === 'number' ? startValue : Number.parseFloat(String(startValue));
    const v1 = typeof endValue === 'number' ? endValue : Number.parseFloat(String(endValue));

    dispatch('imported', new DataSet([
      new EpiPoint(x0, v0),
      new EpiPoint(x1, v1)
    ], name));
  }
</script>

<Dialog title="Add Custom Line" on:close>

  <form class="uk-form-stacked" {id} on:submit={onSubmit}>
    <div>
      <label class="uk-form-label" for="{id}-f">Descriptive Name</label>
      <div class="uk-form-controls">
        <input class="uk-input" type="text" required id="{id}-f" bind:value={name} />
      </div>
    </div>
    <div>
      <label class="uk-form-label" for="{id}-sd">Start Date (format is YYYY-MM-DD or YYYYWW)</label>
      <div class="uk-form-controls">
        <input class="uk-input" type="text" id="{id}-sd" bind:value={startDate} />
      </div>
    </div>
    <div>
      <label class="uk-form-label" for="{id}-ed">End Date (format is YYYY-MM-DD or YYYYWW)</label>
      <div class="uk-form-controls">
        <input class="uk-input" type="text" id="{id}-ed" bind:value={endDate} />
      </div>
    </div>
    <div>
      <label class="uk-form-label" for="{id}-sv">Start Value (any floating point number)</label>
      <div class="uk-form-controls">
        <input class="uk-input" type="number" step="any" required id="{id}-sv" bind:value={startValue} />
      </div>
    </div>
    <div>
      <label class="uk-form-label" for="{id}-sv">End Value (any floating point number)</label>
      <div class="uk-form-controls">
        <input class="uk-input" type="number" step="any" id="{id}-ev" required bind:value={endValue} />
      </div>
    </div>
  </form>

  <button slot="footer" class="uk-button uk-button-primary" type="submit" form={id}>Draw Line</button>
</Dialog>
