<script lang="ts">
  import { DEFAULT_ISSUE } from '../utils';
  import type { IssueSelection } from '../utils';

  export let id: string;

  export let value: IssueSelection = DEFAULT_ISSUE;

  let recent: 'recent' | 'asof' | 'lag' = value?.issues != null ? 'asof' : value?.lag != null ? 'lag' : 'recent';
  let lag = value?.lag ?? 0;
  let asOf = value?.issues != null ? String(value.issues) : '202105';

  $: {
    value = {
      lag: recent === 'lag' ? lag : null,
      issues: recent === 'asof' ? Number.parseInt(asOf, 10) : null,
    };
  }
</script>

<div>
  <div class="uk-form-label">Most Recent Issue</div>
  <div class="uk-form-controls uk-form-controls-text">
    <label
      ><input class="uk-radio" type="radio" name="issue" value="recent" bind:group={recent} />Most Recent Issue (fetch
      the most up-to-date/stable data)</label
    >
    <label
      ><input class="uk-radio" type="radio" name="issue" value="asof" bind:group={recent} />Specific Issue (fetch data
      "as-of" a specific week)</label
    >
    <label
      ><input class="uk-radio" type="radio" name="issue" value="lag" bind:group={recent} />Lagged Data Recent Issue
      (fetch data lagged by a number of weeks)</label
    >
  </div>
</div>
{#if recent == 'asof'}
  <div>
    <label class="uk-form-label" for="{id}-asof">What MMWR week should the data come from? (format: YYYYWW)</label>
    <div class="uk-form-controls">
      <input type="text" class="uk-input" name="asof" required id="{id}-asof" bind:value={asOf} pattern="[0-9]{6}" />
    </div>
  </div>
{:else if recent == 'lag'}
  <div>
    <label class="uk-form-label" for="{id}-lag">How many weeks is the data lagged by?</label>
    <div class="uk-form-controls">
      <input type="number" class="uk-input" name="lag" required id="{id}-lag" bind:value={lag} min="0" />
    </div>
  </div>
{/if}
