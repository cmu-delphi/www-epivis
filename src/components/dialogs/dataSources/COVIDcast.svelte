<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchCOVIDcastMeta, importCOVIDcast } from '../../../api/EpiData';
  import type { LabelValue } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';

  export let id: string;

  let api_key = '';
  let data_source = '';
  let signal = '';
  let geo_type = '';
  let geo_value = '';
  let form_key = '';
  let invalid_key = false;

  let dataSources: (LabelValue & { signals: string[] })[] = [];
  let geoTypes: string[] = [];

  $: dataSignals = (dataSources.find((d) => d.value === data_source) || { signals: [] }).signals;

  $: {
    if (data_source) {
      signal = '';
    }
  }

  function fetchMetadata() {
    fetchCOVIDcastMeta((api_key = form_key)).then((res) => {
      if (res.length !== 0) {
        invalid_key = false;
        api_key = form_key; // API key is valid -> use it to fetch data later on
        geoTypes = [...new Set(res.map((d) => d.geo_type))];
        const byDataSource = new Map<string, LabelValue & { signals: string[] }>();
        for (const row of res) {
          const ds = byDataSource.get(row.data_source);
          if (!ds) {
            byDataSource.set(row.data_source, {
              label: row.data_source,
              value: row.data_source,
              signals: [row.signal],
            });
          } else if (!ds.signals.includes(row.signal)) {
            ds.signals.push(row.signal);
          }
        }
        byDataSource.forEach((entry) => {
          entry.signals.sort();
        });
        dataSources = [...byDataSource.values()].sort((a, b) => a.value.localeCompare(b.value));
      } else {
        invalid_key = api_key != ''; // mark field as invalid, unless it's empty
      }
    });
  }

  onMount(() => {
    fetchMetadata();
  });

  export function importDataSet() {
    return fetchCOVIDcastMeta().then((res) => {
      const meta = res.filter((row) => row.data_source === data_source && row.signal === signal);
      const time_type = meta[0].time_type;
      return importCOVIDcast({ data_source, signal, geo_type, geo_value, time_type, api_key });
    });
  }
</script>

<div>
  <label class="uk-form-label" for="{id}-api">
    <a href="https://cmu-delphi.github.io/delphi-epidata/api/api_keys.html">API Key</a> (optional)
  </label>
  <div class="uk-form-controls">
    <input
      id="{id}-api"
      type="text"
      class="uk-input"
      class:uk-form-danger={invalid_key}
      name="api_key"
      required={false}
      bind:value={form_key}
      on:change={() => fetchMetadata()}
    />
    {#if invalid_key}
      <div class="invalid">API key is invalid - ignoring</div>
    {/if}
  </div>
</div>
<SelectField id="{id}-r" label="Data Source" name="data_source" bind:value={data_source} options={dataSources} />
<SelectField id="{id}-r" label="Data Signal" name="signal" bind:value={signal} options={dataSignals} />
<SelectField id="{id}-gt" label="Geographic Type" bind:value={geo_type} name="geo_type" options={geoTypes} />
<TextField
  id="{id}-gv"
  label="Geographic Value"
  bind:value={geo_value}
  name="geo_values"
  placeholder="e.g., PA or 42003"
/>

<style>
  .invalid {
    color: red;
    font-size: 0.75rem;
  }
</style>
