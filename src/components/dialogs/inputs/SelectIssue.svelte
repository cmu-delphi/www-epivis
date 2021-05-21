<script lang="ts">
  import { DEFAULT_ISSUE } from '../utils';
  import type { IssueSelection } from '../utils';

  export let id: string;
  export let hasLag = true;
  export let hasIssueDay = false;

  export let value: IssueSelection = DEFAULT_ISSUE;

  let recent: 'recent' | 'asof' | 'lag' = value?.issues != null ? 'asof' : value?.lag != null ? 'lag' : 'recent';
  let lag = value?.lag ?? 0;
  let asOf = value?.issues != null ? String(value.issues) : hasIssueDay ? '20201116' : '202105';

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
      "as-of" a specific {hasIssueDay ? 'day' : 'week'})</label
    >
    {#if hasLag}
      <label
        ><input class="uk-radio" type="radio" name="issue" value="lag" bind:group={recent} />Lagged Data Recent Issue
        (fetch data lagged by a number of {hasIssueDay ? 'days' : 'weeks'})</label
      >
    {/if}
  </div>
</div>
{#if recent == 'asof'}
  {#if hasIssueDay}
    <div>
      <label class="uk-form-label" for="{id}-asof">What day should the data come from? (format: YYYYMMDD)</label>
      <div class="uk-form-controls">
        <input type="text" class="uk-input" name="asof" required id="{id}-asof" bind:value={asOf} pattern="[0-9]{8}" />
      </div>
    </div>
  {:else}
    <div>
      <label class="uk-form-label" for="{id}-asof">What MMWR week should the data come from? (format: YYYYWW)</label>
      <div class="uk-form-controls">
        <input type="text" class="uk-input" name="asof" required id="{id}-asof" bind:value={asOf} pattern="[0-9]{6}" />
      </div>
    </div>
  {/if}
{:else if recent == 'lag'}
  <div>
    <label class="uk-form-label" for="{id}-lag">How many {hasIssueDay ? 'days' : 'weeks'} is the data lagged by?</label>
    <div class="uk-form-controls">
      <input type="number" class="uk-input" name="lag" required id="{id}-lag" bind:value={lag} min="0" />
    </div>
  </div>
{/if}
