<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchPopHiveMeta, fetchPopHiveExtraKeyValues, importPopHive } from '../../../api/EpiData';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { apiKey, formSelections } from '../../../store';

  export let id: string;
  let valid_key = true;

  let dataSignals: string[] = [];
  let geoTypes: string[] = [];
  let ageGroups: string[] = [];

  const debounce = (fn: Function, ms = 500) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  function fetchMetadata() {
    fetchPopHiveMeta($apiKey).then((res) => {
      if (Object.keys(res).length === 0) {
        valid_key = false;
      } else {
        valid_key = true;
        const entry = Object.values(res)[0];
        if (entry) {
          dataSignals = [...entry.signals].sort();
          geoTypes = [...entry.geo_types].sort();
        }
      }
    });
    fetchPopHiveExtraKeyValues($apiKey).then((res) => {
      if (res.age_group) {
        ageGroups = [...res.age_group].sort();
      }
    });
  }

  onMount(() => {
    fetchMetadata();
  });

  export function importDataSet() {
    return importPopHive({
      signal: $formSelections.pophive.signal,
      geo_type: $formSelections.pophive.geoType,
      geo_value: $formSelections.pophive.geoValue,
      age_group: $formSelections.pophive.ageGroup,
      api_key: $apiKey,
    });
  }
</script>

<div>
  <label class="uk-form-label" for="{id}-apikey">
    <a href="https://cmu-delphi.github.io/delphi-epidata/api/api_keys.html">API Key</a> (optional)
  </label>
  <div class="uk-form-controls">
    <input
      id="{id}-apikey"
      type="text"
      class="uk-input"
      class:uk-form-danger={!valid_key}
      name="api_key"
      required={false}
      bind:value={$apiKey}
      on:input={debounce(() => fetchMetadata(), 500)}
    />
    {#if !valid_key}
      <div class="invalid">API key is invalid - ignoring</div>
    {/if}
  </div>
</div>
<SelectField
  id="{id}-r"
  label="Data Signal"
  name="signal"
  bind:value={$formSelections.pophive.signal}
  options={dataSignals}
/>
<SelectField
  id="{id}-ag"
  label="Age Group"
  bind:value={$formSelections.pophive.ageGroup}
  name="age_group"
  options={ageGroups}
/>
<SelectField
  id="{id}-gt"
  label="Geographic Type"
  bind:value={$formSelections.pophive.geoType}
  name="geo_type"
  options={geoTypes}
/>
<TextField
  id="{id}-gv"
  label="Geographic Value"
  bind:value={$formSelections.pophive.geoValue}
  name="geo_values"
  placeholder="e.g., PA or 42003"
/>

<style>
  .invalid {
    color: red;
    font-size: 0.75rem;
  }
</style>
