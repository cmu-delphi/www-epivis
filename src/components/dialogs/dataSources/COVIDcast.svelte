<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchCOVIDcastMeta, importCOVIDcast } from '../../../api/EpiData';
  import type { CovidcastMetaResponse } from '../../../api/EpiData';
  import type { LabelValue } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { apiKey, formSelections } from '../../../store';

  export let id: string;
  let valid_key = true;

  let cachedMeta: CovidcastMetaResponse = {};
  let dataSources: (LabelValue & { signals: string[]; geo_types: string[] })[] = [];

  $: dataSignals = (dataSources.find((d) => d.value === $formSelections.covidcast.dataSource) || { signals: [] })
    .signals;

  $: geoTypes = (dataSources.find((d) => d.value === $formSelections.covidcast.dataSource) || { geo_types: [] })
    .geo_types;

  $: {
    if ($formSelections.covidcast.dataSource) {
      dataSignals = (dataSources.find((d) => d.value === $formSelections.covidcast.dataSource) || { signals: [] })
        .signals;
    }
  }

  const debounce = (fn: Function, ms = 500) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  function fetchMetadata() {
    fetchCOVIDcastMeta($apiKey).then((res) => {
      if (Object.keys(res).length === 0) {
        valid_key = false;
      } else {
        valid_key = true;
        cachedMeta = res;
        dataSources = Object.entries(res)
          .map(([name, entry]) => ({
            label: name,
            value: name,
            signals: [...entry.signals].sort(),
            geo_types: [...entry.geo_types].sort(),
          }))
          .sort((a, b) => a.value.localeCompare(b.value));
      }
    });
  }

  onMount(() => {
    fetchMetadata();
  });

  export async function importDataSet() {
    let meta = cachedMeta;
    if (Object.keys(meta).length === 0) {
      meta = await fetchCOVIDcastMeta($apiKey);
    }
    const dataSource = $formSelections.covidcast.dataSource;
    return importCOVIDcast({
      source: dataSource,
      geo_type: $formSelections.covidcast.geoType,
      geo_value: $formSelections.covidcast.geoValue,
      signal: $formSelections.covidcast.signal,
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
  label="Data Source"
  name="source"
  bind:value={$formSelections.covidcast.dataSource}
  options={dataSources}
/>
<SelectField
  id="{id}-r"
  label="Data Signal"
  name="signal"
  bind:value={$formSelections.covidcast.signal}
  options={dataSignals}
/>
<SelectField
  id="{id}-gt"
  label="Geographic Type"
  bind:value={$formSelections.covidcast.geoType}
  name="geo_type"
  options={geoTypes}
/>
<TextField
  id="{id}-gv"
  label="Geographic Value"
  bind:value={$formSelections.covidcast.geoValue}
  required={false}
  name="geo_values"
  placeholder="e.g., PA or 42003"
/>

<style>
  .invalid {
    color: red;
    font-size: 0.75rem;
  }
</style>
