<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchNwssMeta, importNwss } from '../../../api/EpiData';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { apiKey, formSelections } from '../../../store';

  export let id: string;
  let valid_key = true;

  let dataSignals: string[] = [];
  let geoTypes: string[] = [];

  const pcrTargets = [
    'fluav',
    'fluav a h5',
    'hmpxv',
    'hmpxv clade i',
    'hmpxv clade ii',
    'mev_wt',
    'nvo',
    'rsv',
    'sars-cov-2',
  ];
  const nwssSources = ['CDC_Biobot', 'CDC_Verily', 'State_Territory', 'WastewaterSCAN'];
  const fillMethods = ['source'];

  const debounce = (fn: Function, ms = 500) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  function fetchMetadata() {
    fetchNwssMeta($apiKey).then((res) => {
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
  }

  onMount(() => {
    fetchMetadata();
  });

  export function importDataSet() {
    return importNwss({
      signal: $formSelections.nwss.signal,
      geo_type: $formSelections.nwss.geoType,
      geo_value: $formSelections.nwss.geoValue,
      pcr_target: $formSelections.nwss.pcrTarget,
      extra_keys: `nwss_source:${$formSelections.nwss.extraKeys || ''}`,
      fill_method: $formSelections.nwss.fillMethod,
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
  bind:value={$formSelections.nwss.signal}
  options={dataSignals}
/>
<SelectField
  id="{id}-gt"
  label="Geographic Type"
  bind:value={$formSelections.nwss.geoType}
  name="geo_type"
  options={geoTypes}
/>
<SelectField
  id="{id}-pt"
  label="PCR Target"
  bind:value={$formSelections.nwss.pcrTarget}
  name="pcr_target"
  options={pcrTargets}
/>
<SelectField
  id="{id}-ns"
  label="NWSS Source"
  bind:value={$formSelections.nwss.extraKeys}
  name="extra_keys"
  options={nwssSources}
/>
<SelectField
  id="{id}-fm"
  label="Fill Method"
  bind:value={$formSelections.nwss.fillMethod}
  name="fill_method"
  options={fillMethods}
/>
<TextField
  id="{id}-gv"
  label="Geographic Value"
  bind:value={$formSelections.nwss.geoValue}
  name="geo_values"
  placeholder="e.g., PA or 42003"
/>

<style>
  .invalid {
    color: red;
    font-size: 0.75rem;
  }
</style>
