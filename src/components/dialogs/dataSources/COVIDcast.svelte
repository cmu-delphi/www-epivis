<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchCOVIDcastMeta, importCOVIDcast } from '../../../api/EpiData';
  import type { LabelValue } from '../../../data/data';
  import SelectField from '../inputs/SelectField.svelte';
  import TextField from '../inputs/TextField.svelte';
  import { formSelections } from '../../../store';

  export let id: string;

  let data_source = $formSelections.covidcast.dataSource;
  let signal = $formSelections.covidcast.signal;
  let geo_type = $formSelections.covidcast.geoType;
  let geo_value = $formSelections.covidcast.geoValue;

  let dataSources: (LabelValue & { signals: string[] })[] = [];
  let geoTypes: string[] = [];

  $: dataSignals = (dataSources.find((d) => d.value === data_source) || { signals: [] }).signals;

  $: {
    if ($formSelections.covidcast.dataSource) {
      dataSignals = (dataSources.find((d) => d.value === $formSelections.covidcast.dataSource) || { signals: [] })
        .signals;
    }
  }

  onMount(() => {
    fetchCOVIDcastMeta().then((res) => {
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
    });
  });

  export function importDataSet() {
    return fetchCOVIDcastMeta().then((res) => {
      const meta = res.filter((row) => row.data_source === data_source && row.signal === signal);
      const time_type = meta[0].time_type;
      return importCOVIDcast({ data_source, signal, geo_type, geo_value, time_type });
    });
  }
</script>

<SelectField
  id="{id}-r"
  label="Data Source"
  name="data_source"
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
  name="geo_values"
  placeholder="e.g., PA or 42003"
/>
